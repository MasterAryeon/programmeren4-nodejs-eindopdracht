/*
    deelnemer_controller.js   -   Controller for the requests for deelnemer
 */

const sql = require('mssql');
const config = require('../config/config');
const ApiError = require('../domain/ApiError');
const chalk = require('chalk');



module.exports = {

    getDeelnemerList(request, response, next){
        console.log('---------------A GET request was made---------------');
        console.log('-------------------GET deelnemer--------------------');
        response.status(200).json({
            status: 200,
            message: placeHolder
        }).end();
    },

    createDeelnemer(request, response, next){
        console.log('---------------A POST request was made---------------');
        console.log('-------------------POST deelnemer--------------------');
        response.status(200).json({
            status: 200,
            message: placeHolder
        }).end();
    },

    deleteDeelnemer(request, response, next){
        console.log('---------------A DELETE request was made---------------');
        console.log('-------------------DELETE deelnemer--------------------');
        response.status(200).json({
            status: 200,
            message: placeHolder
        }).end();
    }
};