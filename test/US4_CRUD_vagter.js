let expect = require('chai').expect
let chai = require('chai');
let chaiHttp = require('chai-http');
chai.use(chaiHttp);
const app = require('../app');
const controller = require('../controllers/controller')
    
let user = {
  userName: 'hanneOlsen',
  date: '2020-06-03', 
  timeTo: '09:00', 
  timeFrom: '15:00' 
}

  describe('US4 Vagt test', () => {
    it('(POST /vagtApi/insertVagt) : Oprette en vagt til en bruger', (done) => {
    
    chai.request(app)
      .post('/vagtApi/insertVagt')
      .type('form')
      .send(user)
      .end((err, res) => {
        expect(res).to.have.status(200);
        controller.hentVagterForBruger(user.userName)
        .then((snapshot) => {
          let documents = []
          snapshot.forEach(document => { documents.push(document.data())})
          console.log(documents[0])
          expect(documents[0].userName).equal(user.userName);
          expect(documents[0].date).equal(user.date);
          done()
        })
      .catch((error) => {
        done(error)
      })
      });
    });

    it('(GET /userpage/vagter) : Se en vagt på bruger', (done) => {
    chai.request(app)
    .get('/userpage/vagter')
    .end((err, res) => {
      expect(res).to.have.status(200);
      controller.hentVagterForBruger(user.userName)
      .then((snapshot) => {
        let documents = []
        snapshot.forEach(document => { documents.push(document.data())})
        console.log(documents[0])
        expect(documents[0].userName).equal(user.userName);
        expect(documents[0].date).equal(user.date);
        done()
      })
    .catch((error) => {
      done(error)
    })
    });
    });
  });