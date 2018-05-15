/*
    user_login_JSON.js   -  user_login_JSON class
 */

class user_login_JSON {

    //Constructor for user_login_JSON
    constructor(email, password){
        this._email = email;
        this._password = password;
    }
}

//Make user_login_JSON available to other classes
module.exports = user_login_JSON;

