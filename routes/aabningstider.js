const controller = require('../controllers/controller')

const express = require('express')
const router = express.Router()

module.exports = router

db = controller.getDbInstance();

router.get('/rediger', (req, res) => {
    db.collection('aabningstider').get().then(snapshot => {
      let tider = []
      snapshot.forEach(doc => {
        let tid = doc.data() 
        tid.id = doc.id
        tider.push(tid)
      })
      res.render('rediger', {tider: tider});
    });
   });
  
  
   router.get('/aabningstider', (req, res) => {
   let aabtider = db.collection('aabningstider').orderBy('dato', 'asc');
   aabtider.get().then(snapshot => {
     let tider = []
     snapshot.forEach(doc => {
       let tid = doc.data() 
       tid.id = doc.id 
       tider.push(tid)
     })
     res.render('aabningstider', {tider: tider, er_admin: req.session.er_admin})
   })
  })
  
  router.get('/addAabningstid', (req, res) => {
    res.render('addAabningstid');
  });
  
  router.post('/addAabningstid', (req, res) => {
    const navn = req.body.navn;
    const dato = req.body.dato;
    const convertDate = dato.toString();
    const date = convertDate.split("-").reverse().join("-");
    const aaben = req.body.aabner;
    const lukk = req.body.lukker;
  
    db.collection('aabningstider')
    .doc()
    .set({navn: navn, dato: date, aabner: aaben, lukker: lukk})
    .then(() => {
      res.redirect('aabningstider')
      res.end()
    })
  })
  
   router.get('/opdater/:id', (req, res) => {
    const id = req.params.id;
    db.collection("aabningstider").doc(id).get().then(doc => {
      if (!doc.exists) {
        res.status(404).send('Item not found');
        return;
      }
      const tid = doc.data();
      tid.id = doc.id;
      res.render('opdater', { tid });
      });
   });
  
   router.post('/opdater/:id', (req, res) => {
    const id = req.params.id;
    const navn = req.body.navn;
    const dato = req.body.dato;
    const convertDate = dato.toString();
    const date = convertDate.split("-").reverse().join("-");
    const aabner = req.body.aabner;
    const lukker = req.body.lukker;
  
    db.collection('aabningstider').doc(id).update({navn: navn, dato: date, aabner: aabner, lukker: lukker}).then(doc=> {
      res.redirect('/aabningstider/rediger');
      res.end();
    });
   });
     
   router.get('/delete/:id', (req, res) => {
     const id = req.params.id
     db.collection('aabningstider').doc(id).delete().then(doc=>{
       res.redirect('/aabningstider/rediger');
       res.end();
     })
   })