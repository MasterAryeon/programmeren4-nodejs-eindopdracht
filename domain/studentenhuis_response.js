/*
    studentenhuis_response.js   -  studentenhuis_response class
 */

const assert = require('assert');

class studentenhuis_response {

    //Constructor for studentenhuis_response
    constructor(ID, naam, adres, contact, email){

        assert(ID >= 0, 'Een of meer properties in de request body ontbreken of zijn foutief');
        assert(naam !== '', 'Een of meer properties in de request body ontbreken of zijn foutief');
        assert(adres !== '', 'Een of meer properties in de request body ontbreken of zijn foutief');
        assert(contact !== '', 'Een of meer properties in de request body ontbreken of zijn foutief');
        assert(email !== '', 'Een of meer properties in de request body ontbreken of zijn foutief');

        assert(typeof(naam) === 'string', 'Een of meer properties in de request body ontbreken of zijn foutief');
        assert(typeof(adres) === 'string', 'Een of meer properties in de request body ontbreken of zijn foutief');
        assert(typeof(contact) === 'string', 'Een of meer properties in de request body ontbreken of zijn foutief');
        assert(typeof(email) === 'string', 'Een of meer properties in de request body ontbreken of zijn foutief');

        this.ID = ID;
        this.naam = naam;
        this.adres = adres;
        this.contact = contact;
        this.email = email;
    }
}

//Make studentenhuis_response available to other classes
module.exports = studentenhuis_response;

