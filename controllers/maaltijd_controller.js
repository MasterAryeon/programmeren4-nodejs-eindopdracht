/*
    maaltijd_routes.js   -   Routing the requests for maaltijd
 */

const assert = require('assert');
const sql = require('mssql');
const db = require('../config/db');
const config = require('../config/config');
const ApiError = require('../domain/ApiError');
const chalk = require('chalk');

const Maaltijd = require('../domain/maaltijd');
const MaaltijdResponse = require('../domain/maaltijd_response');

module.exports = {
    // function used to get all maaltijden of a given studentenhuisID from the database
    getMaaltijdList(req, res, next){
        console.log('-------------------A GET request was made-------------------');
        console.log('--------------------Get all maaltijden----------------------');
        try {
            const huisId = req.params.id || -1;
            assert(huisId >= 0, 'Een of meer properties in de request body ontbreken of zijn foutief');

            db.then(conn => {
                const statement = new sql.PreparedStatement(conn);
                statement.input('huisID',sql.Int);
                statement.prepare('EXEC getMaaltijdenByHouseId @huisID;').then(s => { //Preparing an SQL statement to prevent SQL Injection
                    s.execute({
                        huisID: huisId
                    }).then(result => {
                        s.unprepare();

                        if(result.recordset.length !== 0) {
                            res.status(200).json(result.recordset).end(); //Response to the request
                        } else {
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
    // function used to get a maaltijd with given ID of a given studentenhuisID from the database
    getMaaltijdById(req, res, next) {
        console.log('------------------A GET request was made-------------------');
        console.log('---------------------Get maaltijd by ID--------------------');

        try {
            const huisId = req.params.id || -1;
            const maaltijdId = req.params.maaltijdId || -1;
            assert(huisId >= 0, 'Een of meer properties in de request body ontbreken of zijn foutief');
            assert(maaltijdId >= 0, 'Een of meer properties in de request body ontbreken of zijn foutief');

            db.then(conn => {
                const statement = new sql.PreparedStatement(conn);
                statement.input('huisID',sql.Int);
                statement.input('maaltijdID',sql.Int);
                statement.prepare('EXEC getMaaltijdWithIdFromHouseId @huisID, @maaltijdID;').then(s => { //Preparing an SQL statement to prevent SQL Injection
                    s.execute({
                        huisID: huisId,
                        maaltijdID: maaltijdId
                    }).then(result => {
                        s.unprepare();

                        const records = result.recordset;
                        if(records.length !== 0) {
                            const row = records[0];
                            if(row.result !== -1) {
                                res.status(200).json(new MaaltijdResponse(row.ID, row.naam, row.beschrijving, row.ingredienten, row.allergie, row.prijs)).end(); //Response to the request
                            } else {
                                console.log(chalk.red('[MSSQL]    ' + 'Niet gevonden (huisId bestaat niet)'));
                                next(new ApiError(404, 'Niet gevonden (huisId bestaat niet)'));
                            }
                        } else {
                            console.log(chalk.red('[MSSQL]    ' + 'Niet gevonden (maaltijdId bestaat niet)'));
                            next(new ApiError(404, 'Niet gevonden (maaltijdId bestaat niet)'));
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
    // function used to add a maaltijd of a given studentenhuisID from the database
    createMaaltijd (req, res, next) {
        console.log('----------------------A POST request was made---------------------');
        console.log('-----------------Adding item to the MaaltijdList------------------');
        try {
            const huisId = req.params.id || -1;
            const naam = req.body.naam || '';
            const beschrijving = req.body.beschrijving || '';
            const ingredienten = req.body.ingredienten || '';
            const allergie = req.body.allergie || '';
            const prijs = req.body.prijs || -1;

            const maaltijd = new Maaltijd(naam, beschrijving, ingredienten, allergie, prijs);

            assert(huisId >= 0, 'Een of meer properties in de request body ontbreken of zijn foutief');
            assert(req.header.tokenid >= 0, 'Een of meer properties in de request header ontbreken of zijn foutief');

            db.then(conn => {
                const statement = new sql.PreparedStatement(conn);
                statement.input('accountID',sql.Int);
                statement.input('huisID',sql.Int);
                statement.input('naam', sql.NVarChar(32));
                statement.input('beschrijving', sql.NVarChar(32));
                statement.input('ingredienten', sql.NVarChar(32));
                statement.input('allergie', sql.NVarChar(32));
                statement.input('prijs', sql.Int);
                statement.prepare('EXEC addMaaltijd @accountID, @huisID, @naam, @beschrijving, @ingredienten, @allergie, @prijs;').then(s => { //Preparing an SQL statement to prevent SQL Injection
                    s.execute({
                        accountID: req.header.tokenid,
                        huisID: huisId,
                        naam: maaltijd.naam,
                        beschrijving: maaltijd.beschrijving,
                        ingredienten: maaltijd.ingredienten,
                        allergie: maaltijd.allergie,
                        prijs: maaltijd.prijs
                    }).then(result => {
                        s.unprepare();

                        const records = result.recordset;
                        if(records[0].result !== -1) {
                            const row = records[0];
                            res.status(200).json(new MaaltijdResponse(row.ID, row.naam, row.beschrijving, row.ingredienten, row.allergie, row.prijs)).end(); //Response to the request
                        } else {
                            console.log(chalk.red('[MSSQL]    ' + 'Niet gevonden (huisId bestaat niet)'));
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
    // function used to update a maaltijd of a given iD of a given studentenhuisID from the database
    putMaaltijdById (req, res, next) {
        console.log('----------------------A PUT request was made---------------------');
        console.log('----------------updating item in the maaltijdList----------------');
        try {

            const huisId = req.params.id || -1;
            const maaltijdId = req.params.maaltijdId || -1;
            const naam = req.body.naam || '';
            const beschrijving = req.body.beschrijving || '';
            const ingredienten = req.body.ingredienten || '';
            const allergie = req.body.allergie || '';
            const prijs = req.body.prijs || -1;

            assert(req.header.tokenid >= 0, 'Een of meer properties in de request header ontbreken of zijn foutief');

            assert(huisId >= 0, 'Een of meer properties in de request parameters ontbreken of zijn foutief');
            assert(maaltijdId >= 0, 'Een of meer properties in de request parameters ontbreken of zijn foutief');

            const maaltijd = new Maaltijd(naam, beschrijving, ingredienten, allergie, prijs);

            db.then(conn => {
                const statement = new sql.PreparedStatement(conn);
                statement.input('accountID',sql.Int);
                statement.input('huisID',sql.Int);
                statement.input('maaltijdID',sql.Int);
                statement.input('naam', sql.NVarChar(32));
                statement.input('beschrijving', sql.NVarChar(32));
                statement.input('ingredienten', sql.NVarChar(32));
                statement.input('allergie', sql.NVarChar(32));
                statement.input('prijs', sql.Int);
                statement.prepare('EXEC updateMaaltijd @accountID, @huisID, @maaltijdID, @naam, @beschrijving, @ingredienten, @allergie, @prijs;').then(s => { //Preparing an SQL statement to prevent SQL Injection
                    s.execute({
                        accountID: req.header.tokenid,
                        huisID: huisId,
                        maaltijdID: maaltijdId,
                        naam: maaltijd.naam,
                        beschrijving: maaltijd.beschrijving,
                        ingredienten: maaltijd.ingredienten,
                        allergie: maaltijd.allergie,
                        prijs: maaltijd.prijs
                    }).then(result => {
                        s.unprepare();

                        const row = result.recordset[0];
                        const update = row.result;
                        switch(update) {
                            case 1:
                                res.status(200).json(new MaaltijdResponse(row.ID, row.naam, row.beschrijving, row.ingredienten, row.allergie, row.prijs)).end(); //Response to the request
                                break;
                            case 0:
                                next(new ApiError(409,'Conflict (Gebruiker mag deze data niet aanpassen)'));
                                break;
                            case -1:
                                next(new ApiError(404, 'Niet gevonden (maaltijdId bestaat niet)'));
                                break;
                            case -2:
                                next(new ApiError(404, 'Niet gevonden (huisId bestaat niet)'));
                                break;
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
    // function used to delete a maaltijd of a given iD of a given studentenhuisID from the database
    deleteMaaltijdById(req, res, next){
        console.log('------------------A DELETE request was made-------------------');
        console.log('--------------------Delete maaltijd by ID---------------------');
        try {
            const huisId = req.params.id || -1;
            const maaltijdId = req.params.maaltijdId || -1;

            assert(req.header.tokenid >= 0, 'Een of meer properties in de request header ontbreken of zijn foutief');
            assert(huisId >= 0, 'Een of meer properties in de request parameters ontbreken of zijn foutief');
            assert(maaltijdId >= 0, 'Een of meer properties in de request parameters ontbreken of zijn foutief');

            db.then(conn => {
                const statement = new sql.PreparedStatement(conn);
                statement.input('huisID',sql.Int);
                statement.input('maaltijdID',sql.Int);
                statement.input('accountID', sql.Int);
                statement.prepare('EXEC deleteMaaltijd @huisID, @maaltijdID, @accountID;').then(s => { //Preparing an SQL statement to prevent SQL Injection
                    s.execute({
                        huisID: huisId,
                        maaltijdID: maaltijdId,
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
                                next(new ApiError(404, 'Niet gevonden (maaltijdId bestaat niet)'));
                                break;
                            case -2:
                                next(new ApiError(404, 'Niet gevonden (huisId bestaat niet)'));
                                break;
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

            /*const connection = new sql.ConnectionPool(config.sql);
            connection.connect().then(conn => {

                const statement = new sql.PreparedStatement(conn);
                statement.input('huisID',sql.Int);
                statement.input('maaltijdID',sql.Int);
                statement.input('accountID', sql.Int);
                statement.prepare('EXEC deleteMaaltijd @huisID, @maaltijdID, @accountID;').then(s => {
                    s.execute({
                        huisID: huisId,
                        maaltijdID: maaltijdId,
                        accountID: req.header.tokenid
                    }).then(result => {
                        s.unprepare();

                        const deletion = result.recordset[0].result;
                        switch(deletion) {
                            case 1:
                                res.status(200).json({}).end();
                                break;
                            case 0:
                                next(new ApiError(409,'Conflict (Gebruiker mag deze data niet verwijderen)'));
                                break;
                            case -1:
                                next(new ApiError(404, 'Niet gevonden (maaltijdId bestaat niet)'));
                                break;
                            case -2:
                                next(new ApiError(404, 'Niet gevonden (huisId bestaat niet)'));
                                break;
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
            });*/

        } catch(error) {
            next(new ApiError(412, error.message));
        }
    }

};
