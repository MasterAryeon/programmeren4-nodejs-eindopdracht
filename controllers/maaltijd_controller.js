/*
    maaltijd_routes.js   -   Routing the requests for maaltijd
 */

const sql = require('mssql');
const config = require('../config/config');
const ApiError = require('../domain/ApiError');
const chalk = require('chalk');

//PLACEHOLDER for the maaltijdList
let maaltijdList;

module.exports = {

    getMaaltijdList(req, res, next){
        console.log('-------------------A GET request was made-------------------');
        console.log('--------------------Get all maaltijden----------------------');
        res.status(200).json(maaltijdList).end(); //Response to the GET request
    },

    getMaaltijdById(req, res, next) {
        console.log('------------------A GET request was made-------------------');
        console.log('---------------------Get maaltijd by ID--------------------');
        const id = req.params.id;  //Requesting the ID for the person object

        if (id >= 0 && id < maaltijdList.length) {
            //The ID is correct - Send the person back
            res.status(200).json(maaltijdList).end(); //Response to the GET request
        } else {
            //The ID is not correct - Error
            const error = {
                error: 'ID does not exist (index out of bounds)',
                url: req.baseUrl,
                statuscode: 404
            };
        }
    },
    createMaaltijdhuis (req, res, next) {
        console.log('----------------------A POST request was made---------------------');
        console.log('-----------------Adding item to the MaaltijdList------------------');
        console.log(req.body); //Printing the POST request's body
        const name = req.body.firstname; //Requesting name from the client
        const adress = req.body.adress; //Requesting adress from the client

        const postMaaltijdhuis = new maaltijd(name, adress); //Making a new maaltijd using the posted name and adress
        maaltijdList.push(studentenhuis); // adding the studentenhuis to the maaltijdList

        //response to the POST request
        res.status(200).json(maaltijd).end();//Response to the POST request
    },

    putMaaltijdById (req, res, next) {
        console.log('----------------------A PUT request was made---------------------');
        console.log('----------------updating item in the maaltijdList----------------');

        const id = req.params.id; //Getting the number from the end of the URL
        const postMaaltijd = new maaltijd(name, adress); //Making a new maaltijd using the posted name and adress



    },

    deleteMaaltijdById(req, res, next){
        console.log('------------------A DELETE request was made-------------------');
        console.log('--------------------Delete maaltijd by ID---------------------');

        const id = req.params.id; //Getting the number from the end of the URL

        //Preconditions
        //id is a number between 0 and the length of the maaltijdList
        assert(req.params.id, 'Invalid ID [1]');
        assert(!isNaN(id) && id >= 0 && id <maaltijdList.length, 'invalid ID [2]');

        //Delete maaltijd with index ID from the maaltijdList Array
        maaltijdList.splice(id,1);

        //Return a status with message
        res.status(200).json(maaltijdList).end();//Response to the DELETE request
    }

};
