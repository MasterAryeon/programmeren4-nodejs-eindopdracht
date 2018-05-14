/*
    maaltijd.js   -  maaltijd class
 */

class maaltijd {

    //Constructor for maaltijd
    constructor(name, description, ingredients, allergies, price){
        this._name = name;
        this._description = description;
        this._ingredients = ingredients;
        this._allergies = allergies;
        this._price = price;

    }
}

//Make maaltijd available to other classes
module.exports = maaltijd;

