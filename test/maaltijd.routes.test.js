const chai = require('chai')
const chaiHttp = require('chai-http')
const server = require('../server')

chai.should();
chai.use(chaiHttp);

let insertedStudentenhuis;
let insertedMaaltijd;

describe('Maaltijd API POST', function() {
    before(() => {
        validToken = require('./authentication.routes.test').token;
        global.validothertoken = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJleHAiOjE1MjcyNjk2MjUsImlhdCI6MTUyNjQwNTYyNSwic3ViIjoxMiwiZW1haWwiOiJyYXdoYW1lcnNAYXZhbnMubmwifQ.wXDTJf1_ikYxjYfQKBboy6s-s28aLWLPHJxkIzJB80g';
        global.invalidothertoken = 'yJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJleHAiOjE1MjcyNjk2MjUsImlhdCI6MTUyNjQwNTYyNSwic3ViIjoxMiwiZW1haWwiOiJyYXdoYW1lcnNAYXZhbnMubmwifQ.wXDTJf1_ikYxjYfQKBboy6s-s28aLWLPHJxkIzJB80g';
    });
    this.timeout(10000);
    it('should return a studentenhuis when posting a valid object',(done) => {
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
                body.should.have.property('naam').equals('Thuis');
                body.should.have.property('adres').equals('Lovendijksstraat, Breda');
                body.should.have.property('contact').equals('Aron Cornet');
                body.should.have.property('email').equals('aron@h-cornet.nl');

                insertedStudentenhuis = body.ID;
                done()
            });

    });
    it('should throw an error when using invalid JWT token', (done) => {
        setTimeout(done, 10000);
        chai.request(server)
            .post('/api/studentenhuis/' + insertedStudentenhuis + '/maaltijd')
            .send({
                naam: "Pizza",
                beschrijving: "Lekker eten",
                ingredienten: "deeg",
                allergie: 'zuivel',
                prijs: 5
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

    it('should return a maaltijd when posting a valid object', (done) => {
        setTimeout(done, 10000);
        chai.request(server)
            .post('/api/studentenhuis/' + insertedStudentenhuis + '/maaltijd')
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
                body.should.have.property('naam').equals('Pizza');
                body.should.have.property('beschrijving').equals('Lekker eten');
                body.should.have.property('ingredienten').equals('deeg');
                body.should.have.property('allergie').equals('zuivel');
                body.should.have.property('prijs').equals(5);

                insertedMaaltijd = body.ID;
                done()
            });
    });

    it('should throw an error when naam is missing', (done) => {
        setTimeout(done, 10000);
        chai.request(server)
            .post('/api/studentenhuis/' + insertedStudentenhuis + '/maaltijd')
            .send({
                beschrijving: "Lekker eten",
                ingredienten: "deeg",
                allergie: 'zuivel',
                prijs: 5
            })
            .set('x-access-token',validToken)
            .end((error, response) => {
                response.should.have.status(412);
                response.should.be.a('object');

                const body = response.body;
                body.should.have.property('status').equals(412);
                body.should.have.property('message').equals('Een of meer properties ontbreken of zijn foutief');
                done()
            });
    });

    it('should throw an error when beschrijving is missing', (done) => {
        setTimeout(done, 10000);
        chai.request(server)
            .post('/api/studentenhuis/' + insertedStudentenhuis + '/maaltijd')
            .send({
                naam: "Pizza",
                ingredienten: "deeg",
                allergie: 'zuivel',
                prijs: 5
            })
            .set('x-access-token',validToken)
            .end((error, response) => {
                response.should.have.status(412);
                response.should.be.a('object');

                const body = response.body;
                body.should.have.property('status').equals(412);
                body.should.have.property('message').equals('Een of meer properties ontbreken of zijn foutief');
                done()
            });
    });
    it('should throw an error when ingredienten is missing', (done) => {
        setTimeout(done, 10000);
        chai.request(server)
            .post('/api/studentenhuis/' + insertedStudentenhuis + '/maaltijd')
            .send({
                naam: "Pizza",
                beschrijving: "Lekker eten",
                allergie: 'zuivel',
                prijs: 5
            })
            .set('x-access-token',validToken)
            .end((error, response) => {
                response.should.have.status(412);
                response.should.be.a('object');

                const body = response.body;
                body.should.have.property('status').equals(412);
                body.should.have.property('message').equals('Een of meer properties ontbreken of zijn foutief');
                done()
            });
    });
    it('should throw an error when allergie is missing', (done) => {
        setTimeout(done, 10000);
        chai.request(server)
            .post('/api/studentenhuis/' + insertedStudentenhuis + '/maaltijd')
            .send({
                naam: "Pizza",
                beschrijving: "Lekker eten",
                ingredienten: "deeg",
                prijs: 5
            })
            .set('x-access-token',validToken)
            .end((error, response) => {
                response.should.have.status(412);
                response.should.be.a('object');

                const body = response.body;
                body.should.have.property('status').equals(412);
                body.should.have.property('message').equals('Een of meer properties ontbreken of zijn foutief');
                done()
            });
    });
    it('should throw an error when prijs is missing', (done) => {
        setTimeout(done, 10000);
        chai.request(server)
            .post('/api/studentenhuis/' + insertedStudentenhuis + '/maaltijd')
            .send({
                naam: "Pizza",
                beschrijving: "Lekker eten",
                ingredienten: "deeg",
                allergie: 'zuivel',
            })
            .set('x-access-token',validToken)
            .end((error, response) => {
                response.should.have.status(412);
                response.should.be.a('object');

                const body = response.body;
                body.should.have.property('status').equals(412);
                body.should.have.property('message').equals('Een of meer properties ontbreken of zijn foutief');
                done()
            });
    })
});

describe('Maaltijd API GET all', function() {
    this.timeout(10000);
    it('should throw an error when using invalid JWT token', (done) => {
        setTimeout(done, 10000);
        chai.request(server)
            .get('/api/studentenhuis/' + insertedStudentenhuis + '/maaltijd')
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

    it('should return all maaltijden when using a valid token', (done) => {
        setTimeout(done, 10000);
        chai.request(server)
            .get('/api/studentenhuis/' + insertedStudentenhuis + '/maaltijd')
            .set('x-access-token',validToken)
            .end((error, response) => {
                response.should.have.status(200);
                done()
            });
    })
});

describe('Maaltijd API GET one', function() {
    this.timeout(10000);
    it('should throw an error when using invalid JWT token', (done) => {
        setTimeout(done, 10000);
        chai.request(server)
            .get('/api/studentenhuis/' + insertedStudentenhuis + '/maaltijd/' + insertedMaaltijd)
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

    it('should return the correct maaltijd when using an existing huisId', (done) => {
        setTimeout(done, 10000);
        chai.request(server)
            .get('/api/studentenhuis/' + insertedStudentenhuis + '/maaltijd/' + insertedMaaltijd)
            .set('x-access-token',validToken)
            .end((error, response) => {
                response.should.have.status(200);
                response.should.be.a('object');

                const body = response.body;

                body.should.have.property('ID');
                body.should.have.property('naam').equals('Pizza');
                body.should.have.property('beschrijving').equals('Lekker eten');
                body.should.have.property('ingredienten').equals('deeg');
                body.should.have.property('allergie').equals('zuivel');
                body.should.have.property('prijs').equals(5);
                done()
            });
    });

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
    });
    it('should return an error when using an non-existing maaltijdId', (done) => {
        setTimeout(done, 10000);
        chai.request(server)
            .get('/api/studentenhuis/' + insertedStudentenhuis + '/maaltijd/999')
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
});



describe('Maaltijd API PUT', function() {
    this.timeout(10000);
    it('should throw an error when using invalid JWT token', (done) => {
        setTimeout(done, 10000);
        chai.request(server)
            .put('/api/studentenhuis/' + insertedStudentenhuis + '/maaltijd/' + insertedMaaltijd)
            .send({
                naam: "Pizza",
                beschrijving: "Lekker eten",
                ingredienten: "deeg",
                allergie: 'zuivel',
                prijs: 5
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

    it('should return a studentenhuis with ID when posting a valid object', (done) => {
        setTimeout(done, 10000);
        chai.request(server)
            .put('/api/studentenhuis/' + insertedStudentenhuis + '/maaltijd/' + insertedMaaltijd)
            .send({
                naam: "Brood",
                beschrijving: "Lekker brood",
                ingredienten: "deeg",
                allergie: 'zuivel',
                prijs: 10
            })
            .set('x-access-token',validToken)
            .end((error, response) => {
                response.should.have.status(200);
                response.should.be.a('object');

                const body = response.body;

                body.should.have.property('ID');
                body.should.have.property('naam').equals('Brood');
                body.should.have.property('beschrijving').equals('Lekker brood');
                body.should.have.property('ingredienten').equals('deeg');
                body.should.have.property('allergie').equals('zuivel');
                body.should.have.property('prijs').equals(10);
                done()
            });
    });

    it('should throw an error when naam is missing', (done) => {
        setTimeout(done, 10000);
        chai.request(server)
            .put('/api/studentenhuis/' + insertedStudentenhuis + '/maaltijd/' + insertedMaaltijd)
            .send({
                beschrijving: "Lekker eten",
                ingredienten: "deeg",
                allergie: 'zuivel',
                prijs: 5
            })
            .set('x-access-token',validToken)
            .end((error, response) => {
                response.should.have.status(412);
                response.should.be.a('object');

                const body = response.body;
                body.should.have.property('status').equals(412);
                body.should.have.property('message').equals('Een of meer properties ontbreken of zijn foutief');
                done()
            });
    });

    it('should throw an error when beschrijving is missing', (done) => {
        setTimeout(done, 10000);
        chai.request(server)
            .put('/api/studentenhuis/' + insertedStudentenhuis + '/maaltijd/' + insertedMaaltijd)
            .send({
                naam: "Pizza",
                ingredienten: "deeg",
                allergie: 'zuivel',
                prijs: 5
            })
            .set('x-access-token',validToken)
            .end((error, response) => {
                response.should.have.status(412);
                response.should.be.a('object');

                const body = response.body;
                body.should.have.property('status').equals(412);
                body.should.have.property('message').equals('Een of meer properties ontbreken of zijn foutief');
                done()
            });
    });
    it('should throw an error when ingredienten is missing', (done) => {
        setTimeout(done, 10000);
        chai.request(server)
            .put('/api/studentenhuis/' + insertedStudentenhuis + '/maaltijd/' + insertedMaaltijd)
            .send({
                naam: "Pizza",
                beschrijving: "Lekker eten",
                allergie: 'zuivel',
                prijs: 5
            })
            .set('x-access-token',validToken)
            .end((error, response) => {
                response.should.have.status(412);
                response.should.be.a('object');

                const body = response.body;
                body.should.have.property('status').equals(412);
                body.should.have.property('message').equals('Een of meer properties ontbreken of zijn foutief');
                done()
            });
    });
    it('should throw an error when allergie is missing', (done) => {
        setTimeout(done, 10000);
        chai.request(server)
            .put('/api/studentenhuis/' + insertedStudentenhuis + '/maaltijd/' + insertedMaaltijd)
            .send({
                naam: "Pizza",
                beschrijving: "Lekker eten",
                ingredienten: "deeg",
                prijs: 5
            })
            .set('x-access-token',validToken)
            .end((error, response) => {
                response.should.have.status(412);
                response.should.be.a('object');

                const body = response.body;
                body.should.have.property('status').equals(412);
                body.should.have.property('message').equals('Een of meer properties ontbreken of zijn foutief');
                done()
            });
    });
    it('should throw an error when prijs is missing', (done) => {
        setTimeout(done, 10000);
        chai.request(server)
            .put('/api/studentenhuis/' + insertedStudentenhuis + '/maaltijd/' + insertedMaaltijd)
            .send({
                naam: "Pizza",
                beschrijving: "Lekker eten",
                ingredienten: "deeg",
                allergie: 'zuivel',
            })
            .set('x-access-token',validToken)
            .end((error, response) => {
                response.should.have.status(412);
                response.should.be.a('object');

                const body = response.body;
                body.should.have.property('status').equals(412);
                body.should.have.property('message').equals('Een of meer properties ontbreken of zijn foutief');
                done()
            });
    });
    it('should return an error when using an non-existing huisId', (done) => {
        setTimeout(done, 10000);
        chai.request(server)
            .put('/api/studentenhuis/9999/maaltijd/' + insertedMaaltijd)
            .send({
                naam: "Pizza",
                beschrijving: "Lekker eten",
                ingredienten: "deeg",
                allergie: 'zuivel',
                prijs: 5
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
    });
    it('should return an error when using an non-existing maaltijdId', (done) => {
        setTimeout(done, 10000);
        chai.request(server)
            .delete('/api/studentenhuis/' + insertedStudentenhuis + '/maaltijd/9999')
            .send({
                naam: "Pizza",
                beschrijving: "Lekker eten",
                ingredienten: "deeg",
                allergie: 'zuivel',
                prijs: 5
            })
            .set('x-access-token',validToken)
            .end((error, response) => {
                response.should.have.status(404);
                response.should.be.a('object');

                const body = response.body;
                body.should.have.property('status').equals(404);
                body.should.have.property('message').equals('Niet gevonden (maaltijdId bestaat niet)');
                done()
            });
    });
    it('should throw an error when trying to delete without permission', (done) => {
        setTimeout(done, 10000);
        chai.request(server)
            .put('/api/studentenhuis/' + insertedStudentenhuis + '/maaltijd/' + insertedMaaltijd)
            .send({
                naam: "Pizza",
                beschrijving: "Lekker eten",
                ingredienten: "deeg",
                allergie: 'zuivel',
                prijs: 5
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
});

describe('Studentenhuis API DELETE',function() {
    this.timeout(10000);
    it('should throw an error when using invalid JWT token', (done) => {
        setTimeout(done, 10000);
        chai.request(server)
            .delete('/api/studentenhuis/' + insertedStudentenhuis + '/maaltijd/' + insertedMaaltijd)
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
    it('should throw an error when trying to delete without permission', (done) => {
        setTimeout(done, 10000);
        chai.request(server)
            .delete('/api/studentenhuis/' + insertedStudentenhuis + '/maaltijd/' + insertedMaaltijd)
            .set('x-access-token',global.validothertoken)
            .end((error, response) => {
                response.should.have.status(409);
                response.should.be.a('object');

                const body = response.body;
                body.should.have.property('status').equals(409);
                body.should.have.property('message').equals('Conflict (Gebruiker mag deze data niet verwijderen)');
                done()
            });
    });
    it('should return an error when using an non-existing huisId', (done) => {
        setTimeout(done, 10000);
        chai.request(server)
            .delete('/api/studentenhuis/999')
            .set('x-access-token',validToken)
            .end((error, response) => {
                response.should.have.status(404);
                response.should.be.a('object');

                const body = response.body;
                body.should.have.property('status').equals(404);
                body.should.have.property('message').equals('Niet gevonden (huisId bestaat niet)');
                done()
            });
    });
    it('should return an error when using an non-existing maaltijdId', (done) => {
        setTimeout(done, 10000);
        chai.request(server)
            .delete('/api/studentenhuis/' + insertedStudentenhuis + '/maaltijd/999')
            .set('x-access-token',validToken)
            .end((error, response) => {
                response.should.have.status(404);
                response.should.be.a('object');

                const body = response.body;
                body.should.have.property('status').equals(404);
                body.should.have.property('message').equals('Niet gevonden (maaltijdId bestaat niet)');
                done()
            });
    });
    it('should return a 200 OK when deleting a valid object', (done) => {
        setTimeout(done, 10000);
        chai.request(server)
            .delete('/api/studentenhuis/' + insertedStudentenhuis + '/maaltijd/' + insertedMaaltijd)
            .set('x-access-token',validToken)
            .end((error, response) => {
                response.should.have.status(200);
                done()
            });
    })
});