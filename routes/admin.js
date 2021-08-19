var crypto = require('crypto');


/*
ADMIN ROUTER
*/

// hent controller funktionalitet
const controller = require('../controllers/controller')

const express = require('express')
const router = express.Router()


const db = controller.getDbInstance()

module.exports = router
/*
router.get('/*', (req, res, next) => {

  console.log(req.session)

  if (req.session.isLoggedIn == true && req.session.er_admin == true) {
    next();
  } else {
    res.status(403).send("FORBIDDEN!")
  }
  
})

router.post('/*', (req, res, next) => {
  
  if ( (req.session.isLoggedIn == true || req.session.isLoggedIn == 'true') && (req.session.er_admin == true || req.session.er_admin == 'true')) {
    next();
  } else {
    res.status(403).send("FORBIDDEN!")
  }
  
}) */

router.get('/users', (req, res) => {
  res.render('users');
  res.end()
})


router.post('/opretBrugerApi', (req, res) => {
  userDict = req.body
  userDict.dateCreated = new Date()

  if (userDict.password !== undefined && userDict.password !== '') {
    userDict.salt = crypto.randomBytes(18).toString('base64');
    userDict.hashed_password = controller.SHA256(userDict.password + userDict.salt)
  }

  delete userDict.password;

  for (key in userDict) {
    if (userDict[key] === undefined || userDict.key === '') {
      delete userDict[key]
    }
  }

  controller.updateUser(userDict).then((data) => {
      res.redirect("/admin/users");
    })
}) 

router.post('/deleteUser', (req, res) => {
  controller.deleteUser(req.body.userName).then(() => {
    res.send("ok") 
  })
})


router.post('/getUsers', (req, res) => {
    controller.dumpBruger().then((data) => {
      res.send(data)
    })
}) 