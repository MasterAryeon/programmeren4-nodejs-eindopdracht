/*
    PLACEHOLDER_controller.js   -   Controller for the requests
 */

const sql = require('mssql');
const config = require('../config/config');
const ApiError = require('../domain/ApiError');
const chalk = require('chalk');

//CONTENT PLACEHOLDER
let placeHolder = 'This is a placeholder for the upcoming content';

module.exports = {

    getPLACEHOLDER(request, response, next){
        console.log('---------------A GET request was made---------------');
        console.log('------------------GET PLACEHOLDER-------------------');
        response.status(200).json({
            status: 200,
            message: placeHolder
        }).end();
    },
};