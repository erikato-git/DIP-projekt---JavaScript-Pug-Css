// hent controller funktionalitet
const controller = require('../controllers/controller')

const express = require('express')
const router = express.Router()
const path = require('path')

const db = controller.getDbInstance()

router.post('/insertVagt', function (req, res) {
    
    console.log(req.body)
    db.collection('Vagter').doc().set(req.body).then(() => {
        res.redirect('/userpage/vagter')
    })
        
})

router.get('/getVagter', function (req, res) {

    controller.dumpVagter().then((data) => {
        
        console.log(data)
        out = {}
        for (let i = 0; i < data.length; i ++) {
            if (data[i].date in out) {
                out[data[i].date].push(data[i])
            } else {
                out[data[i].date] = [data[i]]
            }
        }

        //console.log(out)
        res.send(out)
      })
})


router.get('/', function (req, res) {
    res.send("hello from vagtapi")
})


module.exports = router