const express = require('express')
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')
const session = require('express-session')
const FileStore = require('session-file-store')(session)
const chance = require('chance').Chance()

const sha = require('sha.js')
const models = require('./models')
const valid = require("./validators/form")

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

router.post('/login', async (req, res) => {
  if (!req.session.user) {
    let phone=`+48${req.body.phone}`

    let user = await models.User.where('phone', phone).fetch()

    if (sha('sha256').update(req.body.password).digest('hex') === user.password) {
      req.session.user = user
      res.redirect(`/userPage?loginRedirect=true`)
    } else {
      res.status(401).json({ message: 'invalid credits' })
    }
  } else {
    res.redirect('/userPage')
  }
})

router.post('/register', async (req,res) => {
  let dane = ['phone','name','password']

  const makemsg = valid.make

  for (let d of dane) {
    if(!req.body[d] || req.body[d]=="") {
      res.status(401).json(makemsg(`Invalid ${d}`))
      return
    }
  }

  if(req.body['is_deliver']!=0 && req.body['is_deliver']!=1) {
    res.status(401).json(makemsg('is deliver or not?'))
    return
  }

  //valid phone
  if (!valid.v_phone(req.body.phone)) {
    res.json(makemsg('invalid phone number'))
    return
  }

  let phone = '+48'+req.body.phone;

  //name
  let name=valid.v_name(req.body['name'])

  if(name.statut==true) {
    name=name.word
  } else {
    res.json(makemsg('wrong name'))
    return
  }

  //check & hash passwd
  if (req.body.password.length<6) {
    res.json(makemsg('too short password'))
    return
  }

  let password = sha('sha256').update(req.body.password).digest('hex')

  //generate id & token
  let userid,usertoken,rows,phone_access

  try {
    do {
      userid=chance.bb_pin()
      rows = await models.User.where('id', userid).count()
    } while(rows!=0)

    do {
      usertoken=chance.apple_token()
      rows = await models.User.where('token', usertoken).count()
    } while(rows!=0)

    //check phone nr
    phone_access=await models.User.where('phone',phone).count()

  } catch (error) {
    res.json(makemsg("dupa"))
  }

  if(phone_access==0) {
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
      res.status(200).json(makemsg('user ('+userid+') added', false))
    }).catch((error) => {
      res.json(makemsg(error))
    })
  } else {
    res.json(makemsg('your phone number is already registered'))
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