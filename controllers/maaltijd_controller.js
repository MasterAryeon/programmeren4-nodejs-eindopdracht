/*
    maaltijd_routes.js   -   Routing the requests for maaltijd
 */

const assert = require('assert');
const sql = require('mssql');
const config = require('../config/config');
const ApiError = require('../domain/ApiError');
const chalk = require('chalk');


module.exports = {

    getMaaltijdList(req, res, next){
        console.log('-------------------A GET request was made-------------------');
        console.log('--------------------Get all maaltijden----------------------');
        res.status(200).json({}).end(); //Response to the GET request
    },

    getMaaltijdById(req, res, next) {
        console.log('------------------A GET request was made-------------------');
        console.log('---------------------Get maaltijd by ID--------------------');
        res.status(200).json({}).end(); //Response to the GET request
    },
    createMaaltijd (req, res, next) {
        console.log('----------------------A POST request was made---------------------');
        console.log('-----------------Adding item to the MaaltijdList------------------');
        console.log(req.body); //Printing the POST request's body
        res.status(200).json({}).end(); //Response to the GET request
    },

    putMaaltijdById (req, res, next) {
        console.log('----------------------A PUT request was made---------------------');
        console.log('----------------updating item in the maaltijdList----------------');
        res.status(200).json({}).end(); //Response to the GET request
    },

    deleteMaaltijdById(req, res, next){
        console.log('------------------A DELETE request was made-------------------');
        console.log('--------------------Delete maaltijd by ID---------------------');
        res.status(200).json({}).end(); //Response to the GET request
    }

};
