const express = require('express')
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')
const session = require('express-session')
const FileStore = require('session-file-store')(session)
const { check, validationResult } = require('express-validator')
const validator = require('validator')

const chance = require('chance').Chance()
const sha = require('sha.js')
const models = require('./models')
const valid = require("./validators/form")

const app = express()
const port = process.env.PORT || 8080

app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())
app.use(cookieParser())
app.use(session({ secret: `no way you will guess it`, resave: true, store: new FileStore({ secret: `no way you will guess it`, logFn: args => { return args } }), saveUninitialized: true }))

const router = express.Router();

router.get('/', (req, res) => {
  res.json({
    info: 'Main'
  })
})

router.post('/login', [check('phone').isMobilePhone(), check('password').isLength({ min: 6, max: 30 })], async (req, res) => {
  if (!req.session.user) {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() })
    }

    let phone=`+48${req.body.phone}`

    let user = await models.User.where('phone', phone).fetch()

    if (sha('sha256').update(req.body.password).digest('hex') === user.attributes.password) {
      req.session.user = user
      return res.redirect(`/userPage`)
    } else {
      return res.status(401).json({ message: 'invalid credits' })
    }
  } else {
    return res.redirect('/userPage')
  }
})

router.post('/register', [
  check('phone').isMobilePhone().custom((phone) => {
    return models.User.where('phone', `+48${phone}`).fetchAll().then((users) => {
      if (users.length !== 0) {
        return Promise.reject(new Error('Phone already in use'))
      }
    })
  }),
  check('name').custom((name) => {
      const fullName = name.split(" ");
      if (validator.isAlpha(fullName[0]) && validator.isLength(fullName[0],{min:3,max:30}) && fullName[1]) {
        return true
      } else {
        throw new Error('Invalid name or surname')
      }
  }),
  check('password').isLength({ min: 6, max: 30 }),
  check('is_deliver').isBoolean()
], async (req,res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() })
    }

    let password = sha('sha256').update(req.body.password).digest('hex')

    let newuser = new models.User({
      'id':userid,
      'phone':phone,
      'name':name,
      'password':password,
      'is_deliver':req.body.is_deliver,
      'active':1,
      'token':usertoken
    })

    newuser.save().then(() => {
      res.redirect('/userpage')
    }).catch((error) => {
      res.json(makemsg(error))
    })
  }
)

const authenticateUser = (req, res, next) => {
  if (req.session.user) {
    next()
  } else {
    let err = new Error('User not logged in')
    next(err)
  }
}

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

app.use('/', router)

app.listen(port)
console.log(`Listening on port: ${port}`);