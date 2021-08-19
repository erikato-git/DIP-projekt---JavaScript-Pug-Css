let expect = require('chai').expect
let chai = require('chai');
let chaiHttp = require('chai-http');
chai.use(chaiHttp);
const app = require('../app');
const controller = require('../controllers/controller')

  describe('US1 Login test', () => {
    it('(GET /login) : Validér at siden åbner ', (done) => {
      chai.request(app)
        .get('/login')
        .end((err, res) => {
          expect(res).to.have.status(200);
          done();
        });
    });

    it('(POST /login/auth) : Validér login med gyldigt brugernavn og kodeord og få vist sine egne oplysninger', (done) => {
      let response = chai.request(app)
      //login.pug
      .post('/login/auth')
      .type('form')
      .send({username: "jensJensen", password: "hej123"})
      .end((err, res) => {
        //userpage.pug
        chai.request(app)
        .get('/userpage/profil')
        .end((err, res) => {
          expect(res).to.have.status(200);
          expect(/jensJensen/)
          
          controller.dumpFraDb("jensJensen")
          .then((snapshot) => {
            let documents = []
            snapshot.forEach(document => { documents.push(document.data())})
            expect(documents[0].userName).equal('jensJensen');
            done()
          })
          .catch((error) => {
            done(error)
          })
        });
      });
    })
    it('(POST /login/auth) : Validér login med gyldig brugernavn og (ugyldig) kodeord.', (done) => {
      let response = chai.request(app)
      //login.pug
      .post('/login/auth')
      .type('form')
      .send({username: "jensJensen", password: "hej"})
      .end((err, res) => {
        expect(res).to.have.status(404);
        expect(res).to.not.redirect
        expect(res.text).equal('invalid brugernavn eller kodeord')
        done();
      });
    });

    it('(POST login/auth) : Validér login med (ugyldig) brugernavn og gyldig kodeord.', (done) => {
      chai.request(app)
      //login.pug
      .post('/login/auth')
      .type('form')
      .send({username: "jens", password: "hej123"})
      .end((err, res) => {
        expect(res).to.have.status(404);
        expect(res).to.not.redirect
        expect(res.text).equal('invalid brugernavn eller kodeord')
        done();
      });
    });

    it('(POST /login/auth) : Validér med tomt brugernavn & kodeord', (done) => {
      let response = chai.request(app)
      //login.pug
      .post('/login/auth')
      .type('form')
      .send({username: "", password: ""})
      .end((err, res) => {
        expect(res).to.have.status(404);
        expect(res).to.not.redirect
        expect(res.text).equal('invalid brugernavn eller kodeord')
        done();
      });
    });
  });

