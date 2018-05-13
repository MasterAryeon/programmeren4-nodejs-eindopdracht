var chai = require('chai');
var chaiHttp = require('chai-http');
var server = require('../server');

chai.should();
chai.use(chaiHttp);


/*
    --|IMPORTANT NOTE|--

    Preconditions:
    - The database that is connected to the NodeJS server needs to have the following account
        Account:
            Username:   admin
            Password:   admin
            Firstname:  admin
            Lastname:   admin

    - The database that is connected to the NodeJS server needs not to have the following account
        Account:
            Username:   user
            Password:   user
            Firstname:  user
            Lastname:   user

    --|IMPORTANT NOTE|--
 */
describe('Error handling for login assertions',() => {
    it('Should throw a 401 error when an endpoint is requested, but no token supplied',(done) => {
        chai.request(server)
            .post('/api/nonexistingendpoint')
            .send({

            }).end((error, response) => {
                response.should.have.status(401);
                response.should.be.a('object');

                const body = response.body;
                body.should.have.property('status').equals(401);
                body.should.have.property('message').equals('No token supplied');
                done();
        })
    });

    it('Should throw an assert error when not passing an username when logging in',(done) => {
        chai.request(server)
            .post('/api/login')
            .send({
                password: 'admin'
            }).end((error, response) => {
                response.should.have.status(500);
                response.should.be.a('object');

                const body = response.body;
                body.should.have.property('status').equals(500);
                body.should.have.property('message').equals('Username was not defined or passed as empty');
                done();
        })
    });

    it('Should throw an assert error when passing an empty username when logging in',(done) => {
        chai.request(server)
            .post('/api/login')
            .send({
                username: '',
                password: 'admin'
            }).end((error, response) => {
                response.should.have.status(500);
                response.should.be.a('object');

                const body = response.body;
                body.should.have.property('status').equals(500);
                body.should.have.property('message').equals('Username was not defined or passed as empty');
                done();
        })
    });

    it('Should throw an assert error when not passing a password when logging in',(done) => {
        chai.request(server)
            .post('/api/login')
            .send({
                username: 'admin'
            }).end((error, response) => {
                response.should.have.status(500);
                response.should.be.a('object');

                const body = response.body;
                body.should.have.property('status').equals(500);
                body.should.have.property('message').equals('Password was not defined or passed as empty');
                done();
        })
    });

    it('Should throw an assert error when passing an empty password when logging in',(done) => {
        chai.request(server)
            .post('/api/login')
            .send({
                username: 'admin',
                password: ''
            }).end((error, response) => {
                response.should.have.status(500);
                response.should.be.a('object');

                const body = response.body;
                body.should.have.property('status').equals(500);
                body.should.have.property('message').equals('Password was not defined or passed as empty');
                done();
        })
    })
});

describe('Error handling of registration assertions',() => {
    it('Should throw an assert error when not passing an username when registrating an account',(done) => {
        chai.request(server)
            .post('/api/register')
            .send({
                password: 'user',
                firstname: 'user',
                lastname: 'user'
            }).end((error, response) => {
            response.should.have.status(500);
            response.should.be.a('object');

            const body = response.body;
            body.should.have.property('status').equals(500);
            body.should.have.property('message').equals('Username was not defined or passed as empty');
            done();
        })
    });

    it('Should throw an assert error when passing an empty username when registrating an account',(done) => {
        chai.request(server)
            .post('/api/register')
            .send({
                username: '',
                password: 'user',
                firstname: 'user',
                lastname: 'user'
            }).end((error, response) => {
            response.should.have.status(500);
            response.should.be.a('object');

            const body = response.body;
            body.should.have.property('status').equals(500);
            body.should.have.property('message').equals('Username was not defined or passed as empty');
            done();
        });
    });

    it('Should throw an assert error when not passing an password when registrating an account',(done) => {
        chai.request(server)
            .post('/api/register')
            .send({
                username: 'user',
                firstname: 'user',
                lastname: 'user'
            }).end((error, response) => {
            response.should.have.status(500);
            response.should.be.a('object');

            const body = response.body;
            body.should.have.property('status').equals(500);
            body.should.have.property('message').equals('Password was not defined or passed as empty');
            done();
        })
    });

    it('Should throw an assert error when passing an empty password when registrating an account',(done) => {
        chai.request(server)
            .post('/api/register')
            .send({
                username: 'user',
                password: '',
                firstname: 'user',
                lastname: 'user'
            }).end((error, response) => {
            response.should.have.status(500);
            response.should.be.a('object');

            const body = response.body;
            body.should.have.property('status').equals(500);
            body.should.have.property('message').equals('Password was not defined or passed as empty');
            done();
        })
    });

    it('Should throw an assert error when not passing an firstname when registrating an account',(done) => {
        chai.request(server)
            .post('/api/register')
            .send({
                username: 'user',
                password: 'user',
                lastname: 'user'
            }).end((error, response) => {
            response.should.have.status(500);
            response.should.be.a('object');

            const body = response.body;
            body.should.have.property('status').equals(500);
            body.should.have.property('message').equals('Firstname was not defined or passed as empty');
            done();
        })
    });

    it('Should throw an assert error when passing an empty firstname when registrating an account',(done) => {
        chai.request(server)
            .post('/api/register')
            .send({
                username: 'user',
                password: 'user',
                firstname: '',
                lastname: 'user'
            }).end((error, response) => {
            response.should.have.status(500);
            response.should.be.a('object');

            const body = response.body;
            body.should.have.property('status').equals(500);
            body.should.have.property('message').equals('Firstname was not defined or passed as empty');
            done();
        })
    });

    it('Should throw an assert error when not passing an lastname when registrating an account',(done) => {
        chai.request(server)
            .post('/api/register')
            .send({
                username: 'user',
                password: 'user',
                firstname: 'user'
            }).end((error, response) => {
            response.should.have.status(500);
            response.should.be.a('object');

            const body = response.body;
            body.should.have.property('status').equals(500);
            body.should.have.property('message').equals('Lastname was not defined or passed as empty');
            done();
        })
    });

    it('Should throw an assert error when passing an empty lastname when registrating an account',(done) => {
        chai.request(server)
            .post('/api/register')
            .send({
                username: 'user',
                password: 'user',
                firstname: 'user',
                lastname: ''
            }).end((error, response) => {
            response.should.have.status(500);
            response.should.be.a('object');

            const body = response.body;
            body.should.have.property('status').equals(500);
            body.should.have.property('message').equals('Lastname was not defined or passed as empty');
            done();
        })
    });
});

describe('Error handling for inputting incorrect credentials',() => {
    it('Should throw an error when an invalid username/password combination is provided',(done) => {
       chai.request(server)
           .post('/api/login')
           .send({
               username: 'incorrectusername',
               password: 'incorrectpassword'
           }).end((error, response) => {
           response.should.have.status(500);
           response.should.be.a('object');

           const body = response.body;
           body.should.have.property('status').equals(500);
           body.should.have.property('message').equals('Invalid Username/Password');
           done();
       })
    });
});