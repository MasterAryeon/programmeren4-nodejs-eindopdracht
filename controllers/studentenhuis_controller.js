/*
    studentenhuis_controller.js   -   Controller for the requests for studentenhuis
 */

const sql = require('mssql');
const config = require('../config/config');
const ApiError = require('../domain/ApiError');
const chalk = require('chalk');

//PLACEHOLDER for the studentenhuisList
let studentenhuisList;

module.exports = {

    getStudentenhuisList(req, res, next){
        console.log('-------------------A GET request was made-------------------');
        console.log('------------------Get all Studentenhuizen-------------------');
        try {

            const connection = new sql.ConnectionPool(config.sql);
            connection.connect().then(conn => {

                const statement = new sql.PreparedStatement(conn);
                statement.prepare('EXEC getStudentenhuizen;').then(s => {
                    s.execute({}).then(result => {
                        s.unprepare();

                        res.status(200).json(result.recordset).end();
                    }).catch( err => {
                        console.log(chalk.red('[MSSQL]    ' + err.message));
                        next(new ApiError(500, 'Er heeft een interne fout opgetreden. Probeer het later opnieuw'));
                    });
                }).catch(err => {
                    console.log(chalk.red('[MSSQL]    ' + err.message));
                    next(new ApiError(500, 'Er heeft een interne fout opgetreden. Probeer het later opnieuw'));
                });
            }).catch(err => {
                console.log(chalk.red('[MSSQL]    ' + err.message));
                next(new ApiError(500, 'Er is op dit moment geen verbinding met de database. Probeer het later opnieuw'));
            });
        } catch(error) {
            next(new ApiError(412, error.message));
        }
    },

    getStudentenhuisById(req, res, next) {
        console.log('------------------A GET request was made-------------------');
        console.log('------------------Get studentenhuis by ID------------------');
        res.status(200).json(studentenhuisList).end();//Response to the DELETE request
    },
    createStudentenhuis (req, res, next) {
        console.log('----------------------A POST request was made---------------------');
        console.log('---------------Adding item to the studentenhuisList---------------');
        console.log(req.body); //Printing the POST request's body

        //response to the POST request
        res.status(200).json(studentenhuis).end();//Response to the POST request
    },

    putStudentenhuisById (req, res, next) {
        console.log('----------------------A PUT request was made---------------------');
        console.log('---------------updating item in the studentenhuisList---------------');
        res.status(200).json(studentenhuisList).end();//Response to the DELETE request
    },

    deleteStudentenhuisById(req, res, next){
        console.log('------------------A DELETE request was made-------------------');
        console.log('------------------Delete studentenhuis by ID------------------');

        res.status(200).json(studentenhuisList).end();//Response to the DELETE request
    }

};
