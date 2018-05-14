/*
    valid_token.js   -  valid_token class
 */

class valid_token {

    //Constructor for valid_token
    constructor(token, email){
        this._token = token;
        this._email = email;
    }
}

//Make valid_token available to other classes
module.exports = valid_token;

