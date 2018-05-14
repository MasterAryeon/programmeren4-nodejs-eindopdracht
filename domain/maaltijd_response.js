/*
    maaltijd_response.js   -  maaltijd_response class
 */

class maaltijd_response {

    //Constructor for maaltijd_response
    constructor(ID, name, description, ingredients, allergies, price){
        this._ID = ID;
        this._name = name;
        this._description = description;
        this._ingredients = ingredients;
        this._allergies = allergies;
        this._price = price;
    }
}

//Make maaltijd_response available to other classes
module.exports = maaltijd_response;

