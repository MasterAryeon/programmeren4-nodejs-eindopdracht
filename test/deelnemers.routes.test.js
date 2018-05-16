const chai = require('chai')
const chaiHttp = require('chai-http')
const server = require('../server')

chai.should();
chai.use(chaiHttp);

let insertedStudentenhuis;
let insertedMaaltijd;

describe('Deelnemer API POST', function() {
    this.timeout(10000);
    before(() => {
        validToken = require('./authentication.routes.test').token;
        global.validothertoken = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJleHAiOjE1MjcyNjk2MjUsImlhdCI6MTUyNjQwNTYyNSwic3ViIjoxMiwiZW1haWwiOiJyYXdoYW1lcnNAYXZhbnMubmwifQ.wXDTJf1_ikYxjYfQKBboy6s-s28aLWLPHJxkIzJB80g';
        global.invalidothertoken = 'yJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJleHAiOjE1MjcyNjk2MjUsImlhdCI6MTUyNjQwNTYyNSwic3ViIjoxMiwiZW1haWwiOiJyYXdoYW1lcnNAYXZhbnMubmwifQ.wXDTJf1_ikYxjYfQKBboy6s-s28aLWLPHJxkIzJB80g';
    });

    it('should return a studentenhuis when posting a valid object', (done) => {
        setTimeout(done, 10000);
        chai.request(server)
            .post('/api/studentenhuis')
            .send({
                naam: "Thuis",
                adres: "Lovendijksstraat, Breda",
            })
            .set('x-access-token', validToken)
            .end((error, response) => {
                response.should.have.status(200);
                response.should.be.a('object');

                const body = response.body;
                body.should.have.property('ID');
                body.should.have.property('naam');
                body.should.have.property('adres');
                body.should.have.property('contact');
                body.should.have.property('email');

                insertedStudentenhuis = body.ID;
                done()
            });

    });
    it('should return a maaltijd when posting a valid object', (done) => {
        setTimeout(done, 10000);
        chai.request(server)
            .post('/api/studentenhuis/' + insertedStudentenhuis + '/maaltijd/')
            .send({
                naam: "Pizza",
                beschrijving: "Lekker eten",
                ingredienten: "deeg",
                allergie: 'zuivel',
                prijs: 5
            })
            .set('x-access-token',validToken)
            .end((error, response) => {
                response.should.have.status(200);
                response.should.be.a('object');

                const body = response.body;
                body.should.have.property('ID');
                body.should.have.property('naam');
                body.should.have.property('beschrijving');
                body.should.have.property('ingredienten');
                body.should.have.property('allergie');
                body.should.have.property('prijs');

                insertedMaaltijd = body.ID;
                done()
            });
    })
    it('should throw an error when using invalid JWT token', (done) => {
        setTimeout(done, 10000);
        chai.request(server)
            .post('/api/studentenhuis/' + insertedStudentenhuis + '/maaltijd/' + insertedMaaltijd + '/deelnemers')
            .set('x-access-token',global.invalidothertoken)
            .end((error, response) => {
                response.should.have.status(401);
                response.should.be.a('object');

                const body = response.body;
                body.should.have.property('status').equals(401);
                body.should.have.property('message').equals('Unexpected token ȝ in JSON at position 0');
                done()
            });
    });
    it('should return a deelnemer when posting a valid object', (done) => {
        setTimeout(done, 10000);
        chai.request(server)
            .post('/api/studentenhuis/' + insertedStudentenhuis + '/maaltijd/' + insertedMaaltijd + '/deelnemers')
            .set('x-access-token',validToken)
            .end((error, response) => {
                response.should.have.status(200);
                response.should.be.a('object');

                const body = response.body;
                body.should.have.property('firstname');
                body.should.have.property('lastname');
                body.should.have.property('email');

                done()
            });
    })
    it('should return an error when using an non-existing huisId', (done) => {
        setTimeout(done, 10000);
        chai.request(server)
            .post('/api/studentenhuis/9999/maaltijd/' + insertedMaaltijd + '/deelnemers')
            .set('x-access-token',validToken)
            .end((error, response) => {
                response.should.have.status(404);
                response.should.be.a('object');

                const body = response.body;
                body.should.have.property('status').equals(404);
                body.should.have.property('message').equals('Niet gevonden (huisId bestaat niet)');
                done()
            });
    })
    it('should return an error when using an non-existing maaltijdId', (done) => {
        setTimeout(done, 10000);
        chai.request(server)
            .post('/api/studentenhuis/' + insertedStudentenhuis + '/maaltijd/9999/deelnemers')
            .set('x-access-token',validToken)
            .end((error, response) => {
                response.should.have.status(404);
                response.should.be.a('object');

                const body = response.body;
                body.should.have.property('status').equals(404);
                body.should.have.property('message').equals('Niet gevonden (maaltijdId bestaat niet)');
                done()
            });
    })
    it('should return an error when trying to apply when already applied', (done) => {
        setTimeout(done, 10000);
        chai.request(server)
            .post('/api/studentenhuis/' + insertedStudentenhuis + '/maaltijd/' + insertedMaaltijd + '/deelnemers')
            .set('x-access-token',validToken)
            .end((error, response) => {
                response.should.have.status(409);
                response.should.be.a('object');

                const body = response.body;
                body.should.have.property('status').equals(409);
                body.should.have.property('message').equals('Conflict (Gebruiker is al aangemeld)');
                done()
            });
    })

})

describe('Deelnemer API GET All', function() {
    this.timeout(10000);
    it('should throw an error when using invalid JWT token', (done) => {
        setTimeout(done, 10000);
        chai.request(server)
            .get('/api/studentenhuis/' + insertedStudentenhuis + '/maaltijd/' + insertedMaaltijd + '/deelnemers')
            .set('x-access-token',global.invalidothertoken)
            .end((error, response) => {
                response.should.have.status(401);
                response.should.be.a('object');

                const body = response.body;
                body.should.have.property('status').equals(401);
                body.should.have.property('message').equals('Unexpected token ȝ in JSON at position 0');
                done()
            });
    });

    it('should return all deelnemers when using a valid token', (done) => {
        setTimeout(done, 10000);
        chai.request(server)
            .get('/api/studentenhuis/' + insertedStudentenhuis + '/maaltijd/' + insertedMaaltijd + '/deelnemers')
            .set('x-access-token',validToken)
            .end((error, response) => {
                response.should.have.status(200);
                done()
            });
    })
    it('should return an error when using an non-existing huisId', (done) => {
        setTimeout(done, 10000);
        chai.request(server)
            .get('/api/studentenhuis/9999/maaltijd/' + insertedMaaltijd + '/deelnemers')
            .set('x-access-token',validToken)
            .end((error, response) => {
                response.should.have.status(404);
                response.should.be.a('object');

                const body = response.body;
                body.should.have.property('status').equals(404);
                body.should.have.property('message').equals('Niet gevonden (huisId bestaat niet)');
                done()
            });
    })
    it('should return an error when using an non-existing maaltijdId', (done) => {
        setTimeout(done, 10000);
        chai.request(server)
            .get('/api/studentenhuis/' + insertedStudentenhuis + '/maaltijd/9999/deelnemers')
            .set('x-access-token',validToken)
            .end((error, response) => {
                response.should.have.status(404);
                response.should.be.a('object');

                const body = response.body;
                body.should.have.property('status').equals(404);
                body.should.have.property('message').equals('Niet gevonden (maaltijdId bestaat niet)');
                done()
            });
    })
})
describe('Deelnemers API DELETE',function() {
    this.timeout(10000);
    it('should throw an error when using invalid JWT token', (done) => {
        setTimeout(done, 10000);
        chai.request(server)
            .delete('/api/studentenhuis/' + insertedStudentenhuis + '/maaltijd/' + insertedMaaltijd + '/deelnemers')
            .set('x-access-token',global.invalidothertoken)
            .end((error, response) => {
                response.should.have.status(401);
                response.should.be.a('object');

                const body = response.body;
                body.should.have.property('status').equals(401);
                body.should.have.property('message').equals('Unexpected token ȝ in JSON at position 0');
                done()
            });
    })

    it('should return a 200 OK when deleting a valid object', (done) => {
        setTimeout(done, 10000);
        chai.request(server)
            .delete('/api/studentenhuis/' + insertedStudentenhuis + '/maaltijd/' + insertedMaaltijd + '/deelnemers')
            .set('x-access-token',validToken)
            .end((error, response) => {
                response.should.have.status(200);
                done()
            });
    })
    it('should return an error when using an non-existing huisId', (done) => {
        setTimeout(done, 10000);
        chai.request(server)
            .get('/api/studentenhuis/9999/maaltijd/' + insertedMaaltijd + '/deelnemers')
            .set('x-access-token',validToken)
            .end((error, response) => {
                response.should.have.status(404);
                response.should.be.a('object');

                const body = response.body;
                body.should.have.property('status').equals(404);
                body.should.have.property('message').equals('Niet gevonden (huisId bestaat niet)');
                done()
            });
    })
    it('should return an error when using an non-existing maaltijdId', (done) => {
        setTimeout(done, 10000);
        chai.request(server)
            .get('/api/studentenhuis/' + insertedStudentenhuis + '/maaltijd/9999/deelnemers')
            .set('x-access-token',validToken)
            .end((error, response) => {
                response.should.have.status(404);
                response.should.be.a('object');

                const body = response.body;
                body.should.have.property('status').equals(404);
                body.should.have.property('message').equals('Niet gevonden (maaltijdId bestaat niet)');
                done()
            });
    })
})