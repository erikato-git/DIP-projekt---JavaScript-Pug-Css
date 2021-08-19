
const controller = require('../controllers/controller')

const express = require('express')
const router = express.Router()

module.exports = router

let currentUser;

/*
router.get('/*', (req, res, next) => {
  
  if (req.session.isLoggedIn === true) {
    next();
  } else {
    res.redirect('/login/')
  }
  
})

router.post('/*', (req, res, next) => {
  
  if (req.session.isLoggedIn === true) {
    next();
  } else {
    res.redirect('/login/')
  }
  
}) */


router.get('/profil', (req, res) => {

  const isLoggedIn = req.session.isLoggedIn

  if (!isLoggedIn) {
    res.redirect("/login")
  } else {
    const username = req.session.username
    let userPromise = controller.getUser(username)
    userPromise.then((snapshot) => {
      let documents = []
      snapshot.forEach(document => { documents.push(document.data())})
      
      if (documents.length > 0) {
        user = documents[0]
        res.render('profil', user)
      } else  {
        res.redirect("/login")
      }

    })
    .catch((err) => {
      console.log(err)
    })
  }
});
  
router.post('/profil', (req, res) => {
  console.log(req.body)
  
  const userName = req.body.userName || currentUser.username 
  // const password = req.body.password || currentUser
  const fornavn = req.body.firstName || currentUser.firstName
  const efternavne = req.body.lastName || currentUser.lastName
  const mail_adresse = req.body.email || currentUser.email
  const telefon_nummer = req.body.phone || currentUser.phone
  const address = req.body.address || currentUser.address
  const by = req.body.city || currentUser.city
  const postnummer = req.body.zipCode || currentUser.zipCode
  // const fødselsdato = req.body.fødselsdato || currentUser.fødselsdato
  const gender = req.body.gender
  
  controller.updateUser(userName, fornavn,efternavne,mail_adresse,telefon_nummer,address,by,postnummer, gender)

  res.render('profil')
  res.end()
})


router.get('/vagter', (req, res) => {
  res.render('calendar', {er_admin: req.session.er_admin})
  res.end()
});


//TODO
router.post('/vagter', (req, res) => {

  controller.registrerVagt(username, password)
  res.render('userpage')
  res.end()
})


router.get('/createDummyVagt', (req, res) => {
  res.render('dummyVagt')
})

router.post('/createDummyVagt', (req, res) => {
  const bruger = req.body.username    //man skal ikke indtaste brugernavn, den skal hente det selv
  const dato = req.body.dato          //validering af dato ... !

  controller.createDummyVagt(bruger,dato)
  res.render('dummyVagt')
  res.end()
});




