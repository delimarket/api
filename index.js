const express = require('express')
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')
const session = require('express-session')

const models = require('./models')

const app = express()
const port = process.env.PORT || 8080

app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())
app.use(cookieParser())
app.use(session({ secret: 'secretKey' }))

const router = express.Router();

const User = models.User()

router.get('/', (req, res) => {
  res.json({
    info: 'Main'
  })
})

router.post('/login', (req, res) => {

  User.where('phone','+48'+req.body.phone).fetch().then(function(user) {
    res.json(user)
  })

  if (req.body.phone === 'admin' && req.body.password === 'admin') {
    req.session.user = user
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