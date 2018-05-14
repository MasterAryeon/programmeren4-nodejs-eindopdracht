/*
    studentenhuis_response.js   -  studentenhuis_response class
 */

class studentenhuis_response {

    //Constructor for studentenhuis_response
    constructor(ID, name, adress, contact, email){
        this._ID = ID;
        this._name = name;
        this._adress = adress;
        this._contact = contact;
        this._email = email;
    }
}

//Make studentenhuis_response available to other classes
module.exports = studentenhuis_response;

