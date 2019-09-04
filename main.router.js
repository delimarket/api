const express = require('express')
const router = express.Router()
const { check, validationResult } = require('express-validator')

const sha = require('sha.js')
const models = require('./models')
const chance = require('chance')()

const { isFullName, isPhoneUsed } = require('./helpers/customValidators')
const authenticateUser = require('./helpers/authenicateUser')
const userTokenGenerator = require('./helpers/userTokenGenerator')

const orderRouter = require('./order.router.js')

router.get('/', (req, res) => {
  res.json({
    info: 'Main'
  })
})

router.post(
  '/login',
  [
    check('phone').isMobilePhone(),
    check('password').isLength({ min: 6, max: 30 })
  ],
  async (req, res) => {
    if (!req.session.user) {
      const errors = validationResult(req)
      if (!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.array() })
      }

      const phone = `+48${req.body.phone}`
      const user = await models.User.where('phone', phone).fetch()

      if (
        sha('sha256')
          .update(req.body.password)
          .digest('hex') === user.attributes.password
      ) {
        req.session.user = user
        return res.redirect(`/userPage`)
      } else {
        return res.status(401).json({ message: 'invalid credits' })
      }
    } else {
      return res.redirect('/userPage')
    }
  }
)

router.post(
  '/register',
  [
    check('phone')
      .isMobilePhone()
      .custom(isPhoneUsed),
    check('name').custom(isFullName),
    check('password').isLength({ min: 6, max: 30 }),
    check('is_deliver').isBoolean()
  ],
  async (req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() })
    }

    const password = sha('sha256')
      .update(req.body.password)
      .digest('hex')
    const userToken = userTokenGenerator()

    let userId, rows
    do {
      userId = chance.bb_pin()
      rows = await models.User.where('id', userId).count()
    } while (rows > 0)

    const newuser = new models.User({
      id: userId,
      phone: `+48${req.body.phone}`,
      name: req.body.name,
      password: password,
      is_deliver: parseInt(req.body.is_deliver),
      active: 1,
      token: userToken.hashed
    })

    newuser
      .save(null, { method: 'insert' })
      .then(() => {
        return res.status(200).json({
          message: 'User created successfully',
          data: {
            id: userId,
            phone: `+48${req.body.phone}`,
            name: req.body.name
          }
        })
      })
      .catch(err => {
        console.log(err)
      })
  }
)

router.get('/userPage', authenticateUser, (req, res) => {
  res.json({
    message: 'Welcome to user page',
    user: req.session.user
  })
})

router.get('/logout', (req, res) => {
  req.session.destroy()
  res.json({
    message: 'Logged out'
  })
})

router.use('/order', authenticateUser, orderRouter)

module.exports = router
