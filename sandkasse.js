const controller = require('./controllers/controller')


function getData() {
    // out = []
    // let k = controller.dumpFraDb().then(rows => {
    //     for (let i = 0; i < rows.length ; i++) {
    //         out.push(rows[i].data())
    //     }
        
    //     console.log(out)
    // })


      let userPromise = controller.dumpFraDb("jensJensen")
      userPromise.then((snapshot) => {
        let documents = []
        snapshot.forEach(document => { documents.push(document.data())})
        
        console.log(documents[0])
      })
    
}


getData()