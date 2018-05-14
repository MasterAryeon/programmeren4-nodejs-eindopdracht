/*
    studentenhuis_controller.js   -   Controller for the requests for studentenhuis
 */

const sql = require('mssql');
const config = require('../config/config');
const ApiError = require('../errors/ApiError');
const chalk = require('chalk');

//PLACEHOLDER for the studentenhuisList
let studentenhuisList;

module.exports = {

    getStudentenhuisList(req, res, next){
        console.log('-------------------A GET request was made-------------------');
        console.log('------------------Get all Studentenhuizen-------------------');
        res.status(200).json(studentenhuisList).end(); //Response to the GET request
    },

    getStudentenhuisById(req, res, next) {
        console.log('------------------A GET request was made-------------------');
        console.log('------------------Get studentenhuis by ID------------------');
        const id = req.params.id;  //Requesting the ID for the person object

        if (id >= 0 && id < studentenhuisList.length) {
            //The ID is correct - Send the person back
            res.status(200).json(studentenhuisList).end(); //Response to the GET request
        } else {
            //The ID is not correct - Error
            const error = {
                error: 'ID does not exist (index out of bounds)',
                url: req.baseUrl,
                statuscode: 404
            };
        }
    },
    createStudentenhuis (req, res, next) {
        console.log('----------------------A POST request was made---------------------');
        console.log('---------------Adding item to the studentenhuisList---------------');
        console.log(req.body); //Printing the POST request's body
        const name = req.body.firstname; //Requesting name from the client
        const adress = req.body.adress; //Requesting adress from the client

        const postStudentenhuis = new studentenhuis(name, adress); //Making a new studentenhuis using the posted name and adress
        studentenhuisList.push(studentenhuis); // adding the studentenhuis to the studentenhuisList

        //response to the POST request
        res.status(200).json(studentenhuis).end();//Response to the POST request
    },

    putStudentenhuisById (req, res, next) {
        console.log('----------------------A PUT request was made---------------------');
        console.log('---------------updating item in the studentenhuisList---------------');

        const id = req.params.id; //Getting the number from the end of the URL
        const postStudentenhuis = new studentenhuis(name, adress); //Making a new studentenhuis using the posted name and adress



    },

    deleteStudentenhuisById(req, res, next){
        console.log('------------------A DELETE request was made-------------------');
        console.log('------------------Delete studentenhuis by ID------------------');

        const id = req.params.id; //Getting the number from the end of the URL

        //Preconditions
        //id is a number between 0 and the length of the studentenhuisList
        assert(req.params.id, 'Invalid ID [1]');
        assert(!isNaN(id) && id >= 0 && id <studentenhuisList.length, 'invalid ID [2]');

        //Delete studentenhuis with index ID from the studentenhuisList Array
        studentenhuisList.splice(id,1);

        //Return a status with message
        res.status(200).json(studentenhuisList).end();//Response to the DELETE request
    }

};
