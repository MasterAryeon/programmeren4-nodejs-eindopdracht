/*
    user_register_JSON.js   -  user_register_JSON class
 */

const assert = require('assert');

class user_register_JSON {

    //Constructor for user_register_JSON
    constructor(firstname, lastname, email, password){

        assert(email !== '', 'Een of meer properties in de request body ontbreken of zijn foutief');
        assert(password !== '', 'Een of meer properties in de request body ontbreken of zijn foutief');
        assert(firstname !== '', 'Een of meer properties in de request body ontbreken of zijn foutief');
        assert(lastname !== '', 'Een of meer properties in de request body ontbreken of zijn foutief');

        assert(typeof(email) === 'string', 'Een of meer properties in de request body ontbreken of zijn foutief');
        assert(typeof(password) === 'string', 'Een of meer properties in de request body ontbreken of zijn foutief');
        assert(typeof(firstname) === 'string', 'Een of meer properties in de request body ontbreken of zijn foutief');
        assert(typeof(lastname) === 'string', 'Een of meer properties in de request body ontbreken of zijn foutief');

        this.firstname = firstname;
        this.lastname = lastname;
        this.email = email;
        this.password = password;
    }
}

//Make maaltijd available to other classes
module.exports = user_register_JSON;

