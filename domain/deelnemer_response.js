/*
    deelnemer_response.js   -  deelnemer_response class
 */

const assert = require('assert');

class deelnemer_response {

    //Constructor for deelnemer_response
    constructor(voornaam, achternaam, email){

        assert(voornaam !== '', 'Een of meer properties ontbreken of zijn foutief');
        assert(achternaam !== '', 'Een of meer properties ontbreken of zijn foutief');
        assert(email !== '', 'Een of meer properties ontbreken of zijn foutief');

        assert(typeof(voornaam) === 'string', 'Een of meer properties ontbreken of zijn foutief');
        assert(typeof(achternaam) === 'string', 'Een of meer properties ontbreken of zijn foutief');
        assert(typeof(email) === 'string', 'Een of meer properties ontbreken of zijn foutief');

        this.voornaam = voornaam;
        this.achternaam = achternaam;
        this.email = email;
    }
}

//Make deelnemer_response available to other classes
module.exports = deelnemer_response;

