/*
LOGIN ROUTER
*/

// hent controller funktionalitet
const controller = require('../controllers/controller')

const express = require('express')
const router = express.Router()
const path = require('path')
var crypto = require('crypto');

router.get('/', function (req, res, next) {
  var options = {
    root: path.join(__dirname, '../static')
  }

  if (req.session.isLoggedIn) {
    res.redirect('/userpage/profil')
  } else {

    res.sendFile('login.html', options, function (err) {
      if (err) {
        next(err)
      } else {
          // ok
      }
    })
  }

})

router.get('/logout', (req, res) => {
  if (req.session.isLoggedIn) {
    req.session.destroy()
    res.redirect('/login')
  } else {
    res.redirect('/login')
  }
  res.end()
})

router.get('/createuser', (req, res) => {
  res.render('createuser', {pageTitle: 'Opret Bruger'})
})

router.post('/createuser', (req, res) => {
  const username = req.body.username
  const password = req.body.password
  // lav check på om der står noget i username & password
  controller.createUser(username, password)
  .then(() => {
    req.session.username = username
    req.session.isLoggedIn = true
    res.redirect('/userpage')
    res.end()
  })
  .catch( (err) => {
    res.redirect('/error', {error: err})
  })
})

router.post('/auth', (req, res) => {
  const username = req.body.username
  const password = req.body.password
  let userPromise = controller.getUser(username)
  userPromise.then((snapshot) => {
    if (snapshot.docs.length === 0) {
      res.status(404).send("invalid brugernavn eller kodeord")
    } else {
        user = snapshot.docs[0].data()
        if (user.hashed_password === controller.SHA256(password + user.salt)) {
          req.session.username = username
          req.session.isLoggedIn = true
          if (user.er_admin === true || user.er_admin == 'true') {
          req.session.er_admin = true
        }
        res.redirect('/userpage/profil')
      } else {
        res.status(404).send("invalid brugernavn eller kodeord")
      }
    }
  })
  .catch((err) => {
      console.log(err)
  })
 })
 
router.get('/erJegloggedIn', (req, res) => {
    if (req.session === true) {
    res.send(req.session)
   } else {
    res.send("nej")
   }
})

router.get('/dummy', (req, res) => {

  controller.createDummyuser()
  .then(() => {
    res.send("done")
    res.end()
  })
  .catch( (err) => {
    res.redirect('/error', {error: err})
  })
});

router.get('/dumpDb', (req, res) => {

  controller.dumpBruger()
  .then((data) => {
    res.send(data)
    res.end()
  })
  .catch( (err) => {
    res.redirect('/error', {error: err})
  })

});

router.get('/truncate', (req, res) => {

  controller.truncate()
  .then((data) => {
    res.send(data)
    res.end()
  })
  .catch( (err) => {
    res.redirect('/error', {error: err})
  })

});

module.exports = router