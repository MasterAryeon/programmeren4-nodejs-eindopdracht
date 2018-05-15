/*
    maaltijd.js   -  maaltijd class
 */

const assert = require('assert');

class maaltijd {

    //Constructor for maaltijd
    constructor(naam, beschrijving, ingredienten, allergie, prijs){

        assert(naam !== '', 'Een of meer properties ontbreken of zijn foutief');
        assert(beschrijving !== '', 'Een of meer properties ontbreken of zijn foutief');
        assert(ingredienten !== '', 'Een of meer properties ontbreken of zijn foutief');
        assert(allergie !== '', 'Een of meer properties ontbreken of zijn foutief');
        assert(prijs > 0, 'Een of meer properties ontbreken of zijn foutief');

        assert(typeof(naam) === 'string', 'Een of meer properties ontbreken of zijn foutief');
        assert(typeof(beschrijving) === 'string', 'Een of meer properties ontbreken of zijn foutief');
        assert(typeof(ingredienten) === 'string', 'Een of meer properties ontbreken of zijn foutief');
        assert(typeof(allergie) === 'string', 'Een of meer properties ontbreken of zijn foutief');

        this.naam = naam;
        this.beschrijving = beschrijving;
        this.ingredienten = ingredienten;
        this.allergie = allergie;
        this.prijs = prijs;

    }
}

//Make maaltijd available to other classes
module.exports = maaltijd;

