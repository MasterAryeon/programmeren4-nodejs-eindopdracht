/*
    user_register_JSON.js   -  user_register_JSON class
 */

class user_register_JSON {

    //Constructor for user_register_JSON
    constructor(firstname, lastname, email, password){
        this._firstname = firstname;
        this._lastname = lastname;
        this._email = email;
        this._password = password;
    }
}

//Make maaltijd available to other classes
module.exports = user_register_JSON;

