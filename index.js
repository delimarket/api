const express = require('express')
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')
const session = require('express-session')
const models = require('./models')
const bookshelf = models.bookshelf
const chance = models.chance
const sha = require('sha.js')

const app = express()
const port = process.env.PORT || 8080

app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())
app.use(cookieParser())
app.use(session({ secret: 'secretKey' }))

const router = express.Router();

router.get('/', (req, res) => {
  res.json({
    info: 'Main'
  })
})

const User = new models.User()

router.post('/login', async (req, res) => {
  let phone='+48'+req.body.phone

  let user = await User.where('phone', phone).fetch()

  console.log(req.body)
  console.log(user)

  if (sha('sha256').update(req.body.password).digest('hex') === user.attributes.password) {
    req.session.user = user
    console.log(req.session)
    res.redirect('/userPage')
  } else {
    res.status(401).json({ message: 'invalid credits' })
  }
})

/*
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
    message: 'Successfully logged in',
    user: req.session.user
  })
})

router.get('/logout', (req, res) => {
  req.session.destroy()
  res.json({
    message: 'Logged out'
  })
})*/

app.use('/', router)
app.listen(port)
console.log(`Listening on port: ${port}`);