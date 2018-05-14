/*
    deelnemer_response.js   -  deelnemer_response class
 */

class deelnemer_response {

    //Constructor for deelnemer_response
    constructor(firstname, lastname, email){
        this._firstname = firstname;
        this._lastname = lastname;
        this._email = email;

    }
}

//Make deelnemer_response available to other classes
module.exports = deelnemer_response;

