const express = require('express')
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')
const session = require('express-session')
const FileStore = require('session-file-store')(session)

const sha = require('sha.js')
const models = require('./models')

const app = express()
const port = process.env.PORT || 8080

app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())
app.use(cookieParser())
app.use(session({ secret: `no way you will guess it`, resave: false, store: new FileStore({ secret: `no way you will guess it`, logFn: args => { return args } }), saveUninitialized: true }))

const router = express.Router();

router.get('/', (req, res) => {
  res.json({
    info: 'Main'
  })
})

const User = new models.User()

router.post('/login', async (req, res) => {
  if (!req.session.user) {
    let phone=`+48${req.body.phone}`

    let user = await User.where('phone', phone).fetch()

    if (sha('sha256').update(req.body.password).digest('hex') === user.attributes.password) {
      req.session.user = user
      res.redirect(`/userPage?loginRedirect=true`)
    } else {
      res.status(401).json({ message: 'invalid credits' })
    }
  } else {
    res.redirect('/userPage')
  }
})

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
    message: req.query.loginRedirect === "true" ? 'Successfully logged in': 'Welcome to user page',
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