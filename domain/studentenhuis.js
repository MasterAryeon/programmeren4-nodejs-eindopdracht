/*
    studentenhuis.js   -  studentenhuis class
 */

const assert = require('assert');

class studentenhuis {

    //Constructor for studentenhuis
    constructor(naam, adres){

        assert(naam !== '', 'Een of meer properties in de request body ontbreken of zijn foutief');
        assert(adres !== '', 'Een of meer properties in de request body ontbreken of zijn foutief');
        assert(typeof(naam) === 'string', 'Een of meer properties in de request body ontbreken of zijn foutief');
        assert(typeof(adres) === 'string', 'Een of meer properties in de request body ontbreken of zijn foutief');

        this.naam = naam;
        this.adres = adres;
    }
}

//Make maaltijd available to other classes
module.exports = studentenhuis;

