/*
    studentenhuis.js   -  studentenhuis class
 */

class studentenhuis {

    //Constructor for studentenhuis
    constructor(name, adress){
        this._name = name;
        this._adress = adress;
    }
}

//Make maaltijd available to other classes
module.exports = studentenhuis;

