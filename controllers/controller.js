const config = require('../config')

// Google Cloud Firestore opsætning
const admin = require('firebase-admin')

var crypto = require('crypto');


const serviceAccount = require('../serviceAccountKey.json')

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
})

admin.firestore().settings( { timestampsInSnapshots: true })

//db ref
const db = admin.firestore()

exports.createUser = function(userName, hashedPassword, salt, fornavn) {
    console.log(`[ ${userName} ] er lige blevet oprettet`)
  return db.collection('Users').doc().set({
    userName: userName,
    hashed_password: hashedPassword,
    salt: salt,
    fornavn: fornavn,
    is_one_time_password: true,
    datecreated: (new Date().toISOString())
  })
}
exports.getDbInstance = function(userObject) {
  return db;
}


exports.updateUser = function(userObject) {
  return db.collection('Users')
      .where('userName', '==', userObject.userName).get()
      .then(snapshot => {
          let documents = []
          snapshot.forEach(document => {
              documents.push(document.data())
          })

          if (snapshot.docs.length === 0) {
              db.collection('Users').doc().set(userObject)
          } else {
              const user = snapshot.docs[0];
              user.ref.update(userObject);
          }
      }).catch((err) => {
          console.log("fejl i updateUser()", err)
      })
}

exports.deleteUser = function(userName) {
  var userQuery = db.collection('Users').where('userName','==',userName);

  return userQuery.get().then(function(querySnapshot) {
    querySnapshot.forEach(function(doc) {
      doc.ref.delete();
    });
  });
}


exports.registrerVagt = function(userName, passwd) {
  db.collection('Users').where('brugernavn', '==', userName).get().then(snapshot => {
    // snapshot.userName = userName
    // snapshot.password = passwd
  })
}

exports.hentVagter = async function() {
  // const snapshot = await db.collection('Vagter').get()
  // return snapshot.docs.map(doc => doc.data());
  return db.collection('Vagter').get()
}

exports.hentVagterForBruger = async function(userName) {
  // const snapshot = await db.collection('Vagter').get()
  // return snapshot.docs.map(doc => doc.data());
  return db.collection('Vagter').where('userName', '==', userName).get();
}


exports.findUser = async function(userName){
  let user = controller.getUser(userName)
user.then((snapshot) => {
    return snapshot.docs[0].data().userName
  })
}

exports.getUser = function(userName) {
  return db.collection('Users').where('userName', '==', userName).get()
}

exports.updatePassword = function(hashedPassword, salt, userName) {
    return db.collection('Users').where('userName', '==', userName).get().then((query) => {  
           
      const user = query.docs[0];
      user.ref.update({
        hashed_password: hashedPassword,
        salt: salt,
        is_one_time_password: false
      });
  });
}

dummyBruger = {
  "userName": "jensJensen",
  "firstName": "jens",
  "lastName": "Jensen",
  "email": "jens@mail.com",
  "phone": "112",
  "address": "arhusvej 12",
  "city": "aarhus",
  "zipCode": 6000,
  "birthday": "2001/09/11",
  "sex": "kvinde",
  "hashed_password": "a364e6e2583eaed198034176fb7040656240c2bca383dfd2b9ca842d382dc337",
  "er_admin": true,
  "salt": "1A8FB30"
}

exports.createDummyVagt = function(bruger,dato) {
  db.collection('Vagter').doc().set({
    bruger: bruger,
    dato: dato,
    datecreated: (new Date().toISOString().slice(0,10))
  })
}


exports.createDummyVagt2 = function() {
  db.collection('VagterTemp').doc().set({
    vagtStart: (new Date(2020, 5, 12, 14, 20))    
  })
}

exports.createDummyuser = function() {
  return db.collection('Users').doc().set(dummyBruger)
}

exports.dumpBruger = async function() {
    const snapshot = await db.collection('Users').get()
    return snapshot.docs.map(doc => doc.data());
}

exports.dumpVagter = async function() {
  const snapshot = await db.collection('Vagter').get()
  return snapshot.docs.map(doc => doc.data());
}

exports.dumpFraDb = async function(userName) {
  const snapshot = await db.collection('Users').where('userName', '==', userName).get() // Her kan du lave queries som fx. .where('brugernavn', '==', userName) mellem collection('Users') og .get()
  return snapshot.docs;
}

exports.dumpAabningstider = async function(navn) {
  const snapshot = await db.collection('aabningstider').where('navn', '==', navn).get() 
  return snapshot.docs;
}

exports.truncate = function() {
    return db.collection('Users').listDocuments().then(val => {
        val.map((val) => {
            val.delete()
        })
    })
}

exports.truncateAabningstider = function() {
  return db.collection('aabningstider').listDocuments().then(val => {
      val.map((val) => {
          val.delete()
      })
  })
}

exports.sortJson = function(unordered) {
	const ordered = {};
    Object.keys(unordered).sort().forEach(function(key) {
    ordered[key] = unordered[key];
	});
    return ordered
}

exports.SHA256 = function(d) {
  return crypto.createHash('sha256').update(d).digest('hex');
}

exports.generateVagter2 = function(year, month) {

	vagter = []
	daysInMonth = (new Date(year, month, 0)).getDate()

	for (let day = 1; day < daysInMonth + 1; day++) {
		if ((new Date(2020, month - 1, day)).getDay() > 0) {

			for (let hour = 9; hour <= 17; hour ++) {
				vagter.push(new Date(2020, month - 1, day, hour))
			}
		}
	}
	return vagter
}

exports.generateVagter = function() {

  year = 2020
  month = 5

  vagter = []
	daysInMonth = (new Date(year, month, 0)).getDate()

	for (let day = 1; day < daysInMonth + 1; day++) {
		if ((new Date(2020, month - 1, day)).getDay() > 0) {

			for (let hour = 9; hour <= 17; hour ++) {
				vagter.push(
          {startTidspunkt: new Date(2020, month - 1, day, hour)}
          )
			}
		}
  }
  
  var batch = db.batch()

  vagter.forEach((doc) => {
    var docRef = db.collection("vagter").doc(); //automatically generate unique id
    batch.set(docRef, doc);
  });

  batch.commit()
}
