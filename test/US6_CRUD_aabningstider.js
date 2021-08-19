let expect = require('chai').expect
let chai = require('chai');
let chaiHttp = require('chai-http');
chai.use(chaiHttp);
const app = require('../app');
const controller = require('../controllers/controller')

const event = {
  navn: 'Black Friday',
  dato: '2020-11-27',
  aabner: '22:00',
  lukker: '23:59'
}
let eventNy = {
  navn: 'Black Friday2',
  dato: '2020-11-27',
  aabner: '22:00',
  lukker: '23:59'
}

  describe('US6 CRUD åbningstider', () => {

    let eventId;
    
  it('(GET /aabningstider) : Validér at siden åbner', (done) => {
    controller.truncateAabningstider()
    chai.request(app)
      .get('/aabningstider/aabningstider')
      .end((err, res) => {
        expect(res).to.have.status(200);
        done();
      });
  });

  it('(POST /addAabningstid) : Oprette en ny åbningstid for en begivenhed', (done) => {

    chai.request(app)
      .post('/aabningstider/addAabningstid')
      .type('form')
      .send(event)
      .end((err, res) => {
        expect(res).to.have.status(200);
        controller.dumpAabningstider('Black Friday')
        .then((snapshot) => {
          let documents = []
          snapshot.forEach(document => { 
            eventId = document.id
            documents.push(document.data())})
          expect(documents[0].navn).equal(event.navn)
          expect(documents[0].dato).equal(event.dato.split("-").reverse().join("-"))
          expect(documents[0].aabner).equal(event.aabner)
          expect(documents[0].lukker).equal(event.lukker)
          done()
        })
        .catch((error) => {
          done(error)
        })
      });
  });

  it('(POST /rediger) :  Rediger åbningstid (aabner & lukker) for en bestemt dag: Black Friday', (done) => {

    

    chai.request(app)
    .get('/aabningstider/rediger')
    .end((err, res) => {
      expect(res).to.have.status(200);

      chai.request(app)
        .post('/aabningstider/opdater/'+eventId)
        .type('form')
        .send(eventNy)
        .end((err,res) => {

          controller.dumpAabningstider(eventNy.navn)
          .then((snapshot) => {
            let documents = []
            snapshot.forEach(document => { documents.push(document.data())})
            expect(documents[0].navn).equal(eventNy.navn)
            done()
          })
          .catch((error) => {
            done(error)
          })
        });
  });
  });

  it('(GET /aabningstid) : Se åbningsinformation for en bestemt dag (Black Friday)', (done) => {

      chai.request(app)
        .get('/aabningstider/aabningstider')
        .end((err, res) => {
          expect(res).to.have.status(200);

          controller.dumpAabningstider(eventNy.navn)
          .then((snapshot) => {
            let documents = []
            snapshot.forEach(document => { documents.push(document.data())})
            expect(documents[0].navn).equal(eventNy.navn)
            expect(documents[0].dato).equal(eventNy.dato.split("-").reverse().join("-"))
            expect(documents[0].aabner).equal(eventNy.aabner)
            expect(documents[0].lukker).equal(eventNy.lukker)
            done()
          })
          .catch((error) => {
            done(error)
          })
        });
  });

  it('(POST /rediger) : Slette åbningstid for en bestemt dag (Black Friday)', (done) => {

    chai.request(app)
    .get('/aabningstider/rediger')
    .end((err, res) => {
      expect(res).to.have.status(200);

      chai.request(app)
        .get('/aabningstider/delete/'+eventId)
        .end((err,res) => {

          controller.dumpAabningstider(event.navn)
          .then((snapshot) => {
            let documents = []
            snapshot.forEach(document => { documents.push(document.data())})
            console.log(documents[0])
            expect(documents[0]).to.be.undefined
            done()
          })
          .catch((error) => {
            done(error)
          })
        });
  });
  });
});