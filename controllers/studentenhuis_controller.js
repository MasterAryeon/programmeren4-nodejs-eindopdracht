/*
    studentenhuis_controller.js   -   Controller for the requests for studentenhuis
 */

//Requires for the used modules and files
const assert = require('assert');
const sql = require('mssql');
const db = require('../config/db');
const config = require('../config/config');
const ApiError = require('../domain/ApiError');
const chalk = require('chalk');

const Studentenhuis = require('../domain/studentenhuis');
const StudentenhuisResponse = require('../domain/studentenhuis_response');

module.exports = {
    // function used to get all studentenhuizen from the database
    getStudentenhuisList(req, res, next){
        console.log('-------------------A GET request was made-------------------');
        console.log('------------------Get all Studentenhuizen-------------------');
        try {
            db.then(conn => {
                const statement = new sql.PreparedStatement(conn);
                statement.prepare('EXEC getStudentenhuizen;').then(s => { //Preparing an SQL statements to prevent SQL Injection Error
                    s.execute({}).then(result => {
                        s.unprepare();

                        res.status(200).json(result.recordset).end(); //Response to the request

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
            })
        } catch(error) {
            next(new ApiError(412, error.message));
        }
    },
    // function used to get all studentenhuis from the database by given ID
    getStudentenhuisById(req, res, next) {
        console.log('------------------A GET request was made-------------------');
        console.log('------------------Get studentenhuis by ID------------------');
        try {
            const id = req.params.id || -1; //const using the id from the requests URL or giving it the value -1

            assert(id >= 0, 'Een of meer properties in de request body ontbreken of zijn foutief');

            db.then(conn => {
                const statement = new sql.PreparedStatement(conn);
                statement.input('ID',sql.Int);
                statement.prepare('EXEC getStudentenhuisById @ID;').then(s => { //Preparing an SQL statement to prevent SQL Injection
                    s.execute({
                        ID: id
                    }).then(result => {
                        s.unprepare();

                        if(result.recordset.length !== 0) {
                            res.status(200).json(result.recordset[0]).end(); //Response to the request

                        } else {
                            next(new ApiError(404,'Niet gevonden (huisId bestaat niet)'));
                        }

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
    // function used to add a studentenhuis to the database
    createStudentenhuis (req, res, next) {
        console.log('----------------------A POST request was made---------------------');
        console.log('---------------Adding item to the studentenhuisList---------------');

        try {
            //Creating constants filled with empty strings or the requested items from the body
            const naam = req.body.naam || '';
            const adres = req.body.adres || '';

            assert(req.header.tokenid >= 0, 'Een of meer properties in de request header ontbreken of zijn foutief');
            const studentenhuis = new Studentenhuis(naam, adres);

            db.then(conn => {
                const statement = new sql.PreparedStatement(conn);
                statement.input('naam', sql.NVarChar(32));
                statement.input('adres', sql.NVarChar(32));
                statement.input('accountID', sql.Int);
                statement.prepare('EXEC addStudentenhuis @naam, @adres, @accountID;').then(s => { //Preparing an SQL statement to prevent SQL Injection
                    s.execute({
                        naam: studentenhuis.naam,
                        adres: studentenhuis.adres,
                        accountID: req.header.tokenid
                    }).then(result => {
                        s.unprepare();

                        const row = result.recordset[0];
                        res.status(200).json(new StudentenhuisResponse(row.ID, row.naam, row.adres, row.contact, row.email)).end(); //Responding to the request

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
    // function used to update a studentenhuis in the database
    putStudentenhuisById (req, res, next) {
        console.log('----------------------A PUT request was made---------------------');
        console.log('---------------updating item in the studentenhuisList---------------');
        try {
            const huisId = req.params.id || -1;
            const naam = req.body.naam || '';
            const adres = req.body.adres || '';

            const studentenhuis = new Studentenhuis(naam, adres);

            assert(huisId >= 0, 'Een of meer properties in de request parameters ontbreken of zijn foutief');
            assert(req.header.tokenid >= 0, 'Een of meer properties in de request header ontbreken of zijn foutief');

            db.then(conn => {
                const statement = new sql.PreparedStatement(conn);
                statement.input('huisID',sql.Int);
                statement.input('naam', sql.NVarChar(32));
                statement.input('adres', sql.NVarChar(32));
                statement.input('accountID', sql.Int);
                statement.prepare('EXEC updateStudentenhuis @huisID, @naam, @adres, @accountID;').then(s => { //Preparing an SQL statement to prevent SQL Injection
                    s.execute({
                        huisID: huisId,
                        naam: studentenhuis.naam,
                        adres: studentenhuis.adres,
                        accountID: req.header.tokenid
                    }).then(result => {
                        s.unprepare();

                        const row = result.recordset[0];
                        const update = row.result;
                        switch(update) {
                            case 1:
                                res.status(200).json(new StudentenhuisResponse(row.ID, row.naam, row.adres, row.contact, row.email)).end(); //Responding to the request
                                break;
                            case 0:
                                next(new ApiError(409,'Conflict (Gebruiker mag deze data niet aanpassen)'));
                                break;
                            case -1:
                                next(new ApiError(404, 'Niet gevonden (huisId bestaat niet)'));
                        }

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
    // function used to delete a studentenhuis in the database
    deleteStudentenhuisById(req, res, next){
        console.log('------------------A DELETE request was made-------------------');
        console.log('------------------Delete studentenhuis by ID------------------');

        try {
            const huisId = req.params.id || -1;
            assert(huisId >= 0, 'Een of meer properties in de request parameters ontbreken of zijn foutief');
            assert(req.header.tokenid >= 0, 'Een of meer properties in de request header ontbreken of zijn foutief');

            db.then(conn => {
                const statement = new sql.PreparedStatement(conn);
                statement.input('huisID',sql.Int);
                statement.input('accountID', sql.Int);
                statement.prepare('EXEC deleteStudentenhuisById @huisID, @accountID;').then(s => { //Preparing an SQL statement to prevent SQL Injection
                    s.execute({
                        huisID: huisId,
                        accountID: req.header.tokenid
                    }).then(result => {
                        s.unprepare();

                        const deletion = result.recordset[0].result;
                        switch(deletion) {
                            case 1:
                                res.status(200).json({}).end(); //Response to the request
                                break;
                            case 0:
                                next(new ApiError(409,'Conflict (Gebruiker mag deze data niet verwijderen)'));
                                break;
                            case -1:
                                next(new ApiError(404, 'Niet gevonden (huisId bestaat niet)'));
                        }

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
    }

};
