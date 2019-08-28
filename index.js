const express = require('express')
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')
const session = require('express-session')
const FileStore = require('session-file-store')(session)

const router = require('./router')

const app = express()
const port = process.env.PORT || 8080

app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())
app.use(cookieParser())
app.use(session({ secret: `no way you will guess it`, resave: true, store: new FileStore({ secret: `no way you will guess it`, logFn: args => { return args } }), saveUninitialized: true }))

app.use('/', router)

app.listen(port)
console.log(`Listening on port: ${port}`);