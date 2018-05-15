/*
    valid_token.js   -  valid_token class
 */

const assert = require('assert');

class valid_token {

    //Constructor for valid_token
    constructor(token, email) {

        assert(token !== '', 'Een of meer properties in de request body ontbreken of zijn foutief');
        assert(email !== '', 'Een of meer properties in de request body ontbreken of zijn foutief');
        assert(typeof(token) === 'string', 'Een of meer properties in de request body ontbreken of zijn foutief');
        assert(typeof(email) === 'string', 'Een of meer properties in de request body ontbreken of zijn foutief');

        this.token = token;
        this.email = email;
    }
}

//Make valid_token available to other classes
module.exports = valid_token;

