const express = require('express')
const app = express()

const config = require('./config')

const path = require('path');

// Logging - så req bliver mere synlig i consollen
const morgan = require('morgan')
app.use(morgan('tiny'))

// anvend assets mappe til statiske filer
app.use(express.static('assets'))

// template engine opsætning
app.set('view engine', 'pug')

// Dette er post data encoding
app.use(express.json())
app.use(express.urlencoded())

// Session opsætning
session = require('express-session');
app.use(session({
  secret: config.sessionSecret
}))

// mere middleware
// check om man er logget ind

if (app.get('env') === 'development') {
  app.locals.pretty = true;
}
  var crypto = require('crypto');
  salt = crypto.randomBytes(18).toString('base64');
// ALLE ROUTES KOMMER HER
const loginRouter = require('./routes/login')
app.use('/login', loginRouter)

const adminRouter = require('./routes/admin')
app.use('/admin', adminRouter)

const userpageRouter = require('./routes/userpage')
app.use('/userpage', userpageRouter)

const aabningstiderRouter = require('./routes/aabningstider')
app.use('/aabningstider', aabningstiderRouter)

const vagtApiRouter = require('./routes/vagtApi.js')
app.use('/vagtApi', vagtApiRouter)

app.use('/static', express.static(path.join(__dirname, 'static')))

app.get('/', (req, res) => {
  res.redirect('/aabningstider/aabningstider')
})





// Start server
app.listen(config.serverPort, () => console.log(`Server started on port ${config.serverPort}`))


// exports.app = app;  //virker kun for supertests
module.exports = app  //virker kun for chai og chai-http
