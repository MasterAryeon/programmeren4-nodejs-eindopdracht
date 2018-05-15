/*
    deelnemer_response.js   -  deelnemer_response class
 */

const assert = require('assert');

class deelnemer_response {

    //Constructor for deelnemer_response
    constructor(firstname, lastname, email){

        assert(firstname !== '', 'Een of meer properties ontbreken of zijn foutief');
        assert(lastname !== '', 'Een of meer properties ontbreken of zijn foutief');
        assert(email !== '', 'Een of meer properties ontbreken of zijn foutief');

        assert(typeof(firstname) === 'string', 'Een of meer properties ontbreken of zijn foutief');
        assert(typeof(lastname) === 'string', 'Een of meer properties ontbreken of zijn foutief');
        assert(typeof(email) === 'string', 'Een of meer properties ontbreken of zijn foutief');

        this.firstname = firstname;
        this.lastname = lastname;
        this.email = email;
    }
}

//Make deelnemer_response available to other classes
module.exports = deelnemer_response;

