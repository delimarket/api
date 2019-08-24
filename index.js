const express = require('express')
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')
const session = require('express-session')
const models = require('./models')
const bookshelf = models.bookshelf
const chance = models.chance

const app = express()
const port = process.env.PORT || 8080

app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())
app.use(cookieParser())
app.use(session({ secret: 'secretKey' }))

const router = express.Router();

const authenticateUser = (req, res, next) => {
  if (req.session.user) {
    next()
  } else {
    let err = new Error('User not logged in')
    next(err)
  }
}

router.get('/', (req, res) => {
  res.json({
    message: 'Hello world!'
  })
})

router.post('/login', (req, res) => {
  if (req.body.username === 'admin' && req.body.password === 'admin') {
    let user = { username: 'admin', password: 'admin' }
    req.session.user = user
    res.redirect('/userPage')
  } else {
    res.status(401).json({ message: 'invalid credits' })
  }
})

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
})

app.use('/', router)
app.listen(port)
console.log(`Listening on port: ${port}`);