const chai = require('chai')
const chaiHttp = require('chai-http')
const server = require('../server')

chai.should();
chai.use(chaiHttp);

let insertedStudentenhuis;

describe('Studentenhuis API POST', function() {
    before(() => {
        validToken = require('./authentication.routes.test').token;
        global.validothertoken = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJleHAiOjE1MjcyODE0NTQsImlhdCI6MTUyNjQxNzQ1NCwic3ViIjoxMiwiZW1haWwiOiJyYXdoYW1lcnNAYXZhbnMubmwifQ.n6uEAzojz2TfXi5UzDweWIJOdNbiWbTe9MtY27iM-8o';
        global.invalidothertoken = 'yJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJleHAiOjE1MjcyODE0NTQsImlhdCI6MTUyNjQxNzQ1NCwic3ViIjoxMiwiZW1haWwiOiJyYXdoYW1lcnNAYXZhbnMubmwifQ.n6uEAzojz2TfXi5UzDweWIJOdNbiWbTe9MtY27iM-8o';
    });
    this.timeout(10000);
    it('should throw an error when using invalid JWT token', (done) => {
        chai.request(server)
            .post('/api/studentenhuis')
            .send({
                naam: "Thuis",
                adres: "Lovendijksstraat, Breda",
            })
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

    it('should return a studentenhuis when posting a valid object', (done) => {
        setTimeout(done, 10000);
        chai.request(server)
            .post('/api/studentenhuis')
            .send({
                naam: "Thuis",
                adres: "Lovendijksstraat, Breda",
            })
            .set('x-access-token',validToken)
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
                module.exports = {
                    token: validToken
                }
                done()
            });
    })

    it('should throw an error when naam is missing', (done) => {
        setTimeout(done, 10000);
        chai.request(server)
            .post('/api/studentenhuis')
            .send({
                adres: "Lovendijksstraat, Breda",
            })

            .set('x-access-token',validToken)
            .end((error, response) => {
                response.should.have.status(412);
                response.should.be.a('object');

                const body = response.body;
                body.should.have.property('status').equals(412);
                body.should.have.property('message').equals('Een of meer properties in de request body ontbreken of zijn foutief');
                done()
            });
    })

    it('should throw an error when adres is missing', (done) => {
        setTimeout(done, 10000);
        chai.request(server)
            .post('/api/studentenhuis')
            .send({
                naam: "Thuis",
            })
            .set('x-access-token',validToken)
            .end((error, response) => {
                response.should.have.status(412);
                response.should.be.a('object');

                const body = response.body;
                body.should.have.property('status').equals(412);
                body.should.have.property('message').equals('Een of meer properties in de request body ontbreken of zijn foutief');
                done()
            });
    })
})

describe('Studentenhuis API GET all', function() {
    this.timeout(10000);
    it('should throw an error when using invalid JWT token', (done) => {
        setTimeout(done, 10000);
        chai.request(server)
            .get('/api/studentenhuis')
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

    it('should return all studentenhuizen when using a valid token', (done) => {
        setTimeout(done, 10000);
        chai.request(server)
            .get('/api/studentenhuis')
            .set('x-access-token',validToken)
            .end((error, response) => {
                response.should.have.status(200);
                done()
            });
    })
})

describe('Studentenhuis API GET one', function() {
    this.timeout(10000);
    it('should throw an error when using invalid JWT token', (done) => {
        setTimeout(done, 10000);
        chai.request(server)
            .get('/api/studentenhuis/' + insertedStudentenhuis)
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

    it('should return the correct studentenhuis when using an existing huisId', (done) => {
        setTimeout(done, 10000);
        chai.request(server)
            .get('/api/studentenhuis/' + insertedStudentenhuis)
            .set('x-access-token',validToken)
            .end((error, response) => {
                response.should.have.status(200);
                response.should.be.a('object');

                const body = response.body;

                body.should.have.property('ID');
                body.should.have.property('naam');
                body.should.have.property('adres');
                body.should.have.property('contact');
                body.should.have.property('email');
                done()
            });
    })

    it('should return an error when using an non-existing huisId', (done) => {
        setTimeout(done, 10000);
        chai.request(server)
            .get('/api/studentenhuis/999')
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
})

describe('Studentenhuis API PUT', function() {
    this.timeout(10000);
    it('should throw an error when using invalid JWT token', (done) => {
        setTimeout(done, 10000);
        chai.request(server)
            .put('/api/studentenhuis/' + insertedStudentenhuis)
            .send({
                naam: "Werk",
                adres: "Hogeschoollaan, Breda"
            })
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

    it('should return a studentenhuis with ID when posting a valid object', (done) => {
        setTimeout(done, 10000);
        chai.request(server)
            .put('/api/studentenhuis/' + insertedStudentenhuis)
            .send({
                naam: "Werk",
                adres: "Hogeschoollaan, Breda"
            })
            .set('x-access-token',validToken)
            .end((error, response) => {
                response.should.have.status(200);
                response.should.be.a('object');

                const body = response.body;

                body.should.have.property('ID');
                body.should.have.property('naam');
                body.should.have.property('adres');
                body.should.have.property('contact');
                body.should.have.property('email');
                done()
            });
    })

    it('should throw an error when naam is missing', (done) => {
        setTimeout(done, 10000);
        chai.request(server)
            .put('/api/studentenhuis/' + insertedStudentenhuis)
            .send({
                adres: "Hogeschoollaan, Breda"
            })
            .set('x-access-token',validToken)
            .end((error, response) => {
                response.should.have.status(412);
                response.should.be.a('object');

                const body = response.body;
                body.should.have.property('status').equals(412);
                body.should.have.property('message').equals('Een of meer properties in de request body ontbreken of zijn foutief');
                done()
            });
    })

    it('should throw an error when adres is missing', (done) => {
        setTimeout(done, 10000);
        chai.request(server)
            .put('/api/studentenhuis/' + insertedStudentenhuis)
            .send({
                naam: "Werk",
            })
            .set('x-access-token',validToken)
            .end((error, response) => {
                response.should.have.status(412);
                response.should.be.a('object');

                const body = response.body;
                body.should.have.property('status').equals(412);
                body.should.have.property('message').equals('Een of meer properties in de request body ontbreken of zijn foutief');
                done()
            });
        it('should throw an error when trying to delete without permission', (done) => {
            setTimeout(done, 10000);
            chai.request(server)
                .put('/api/studentenhuis/' + insertedStudentenhuis)
                .send({
                    naam: "Thuis",
                    adres: "Lovendijksstraat, Breda",
                })
                .set('x-access-token',global.validothertoken)
                .end((error, response) => {
                    response.should.have.status(409);
                    response.should.be.a('object');

                    const body = response.body;
                    body.should.have.property('status').equals(409);
                    body.should.have.property('message').equals('Conflict (Gebruiker mag deze data niet aanpassen)');
                    done()
                });
        })
        it('should throw an error when trying to delete a non existing huisId', (done) => {
            setTimeout(done, 10000);
            chai.request(server)
                .put('/api/studentenhuis/9999')
                .send({
                    naam: "Thuis",
                    adres: "Lovendijksstraat, Breda",
                })
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
    })
})

describe('Studentenhuis API DELETE', function() {
    this.timeout(10000);
    it('should throw an error when using invalid JWT token', (done) => {
        setTimeout(done, 10000);
        chai.request(server)
            .delete('/api/studentenhuis/' + insertedStudentenhuis)
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

    it('should throw an error when trying to delete without permission', (done) => {
        setTimeout(done, 10000);
        chai.request(server)
            .delete('/api/studentenhuis/' + insertedStudentenhuis)
            .send({
                naam: "Thuis",
                adres: "Lovendijksstraat, Breda",
            })
            .set('x-access-token',global.validothertoken)
            .end((error, response) => {
                response.should.have.status(409);
                response.should.be.a('object');

                const body = response.body;
                body.should.have.property('status').equals(409);
                body.should.have.property('message').equals('Conflict (Gebruiker mag deze data niet verwijderen)');
                done()
            });
    })
    it('should throw an error when trying to delete a non existing huisId', (done) => {
        setTimeout(done, 10000);
        chai.request(server)
            .delete('/api/studentenhuis/9999')
            .send({
                naam: "Thuis",
                adres: "Lovendijksstraat, Breda",
            })
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
    it('should return a studentenhuis when posting a valid object', (done) => {
        setTimeout(done, 10000);
        chai.request(server)
            .delete('/api/studentenhuis/' + insertedStudentenhuis)
            .send({
                naam: "Thuis",
                adres: "Lovendijksstraat, Breda",
            })
            .set('x-access-token',validToken)
            .end((error, response) => {
                response.should.have.status(200);
                done()
            });
    })
})