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
        try {
            const huisId = req.params.id || -1;
            assert(huisId >= 0, 'Een of meer properties in de request body ontbreken of zijn foutief');

            const connection = new sql.ConnectionPool(config.sql);
            connection.connect().then(conn => {

                const statement = new sql.PreparedStatement(conn);
                statement.input('huisID',sql.Int);
                statement.prepare('EXEC getMaaltijdenByHouseId @huisID;').then(s => {
                    s.execute({
                        huisID: huisId
                    }).then(result => {
                        s.unprepare();

                        if(result.recordset.length !== 0) {
                            res.status(200).json(result.recordset).end();
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

    getMaaltijdById(req, res, next) {
        console.log('------------------A GET request was made-------------------');
        console.log('---------------------Get maaltijd by ID--------------------');

        try {
            const huisId = req.params.id || -1;
            const maaltijdId = req.params.maaltijdId || -1;
            assert(huisId >= 0, 'Een of meer properties in de request body ontbreken of zijn foutief');
            assert(maaltijdId >= 0, 'Een of meer properties in de request body ontbreken of zijn foutief');

            const connection = new sql.ConnectionPool(config.sql);
            connection.connect().then(conn => {

                const statement = new sql.PreparedStatement(conn);
                statement.input('huisID',sql.Int);
                statement.input('maaltijdID',sql.Int);
                statement.prepare('EXEC getMaaltijdWithIdFromHouseId @huisID, @maaltijdID;').then(s => {
                    s.execute({
                        huisID: huisId,
                        maaltijdID: maaltijdId
                    }).then(result => {
                        s.unprepare();

                        const records = result.recordset;
                        if(records.length !== 0) {
                            if(records[0].result !== -1) {
                                res.status(200).json(result.recordset[0]).end();
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

            assert(huisId >= 0, 'Een of meer properties in de request body ontbreken of zijn foutief');
            assert(naam !== '', 'Een of meer properties in de request body ontbreken of zijn foutief');
            assert(beschrijving !== '', 'Een of meer properties in de request body ontbreken of zijn foutief');
            assert(ingredienten !== '', 'Een of meer properties in de request body ontbreken of zijn foutief');
            assert(allergie !== '', 'Een of meer properties in de request body ontbreken of zijn foutief');
            assert(prijs > 0, 'Een of meer properties in de request body ontbreken of zijn foutief');
            const connection = new sql.ConnectionPool(config.sql);
            connection.connect().then(conn => {

                const statement = new sql.PreparedStatement(conn);
                statement.input('accountID',sql.Int);
                statement.input('huisID',sql.Int);
                statement.input('naam', sql.NVarChar(32));
                statement.input('beschrijving', sql.NVarChar(32));
                statement.input('ingredienten', sql.NVarChar(32));
                statement.input('allergie', sql.NVarChar(32));
                statement.input('prijs', sql.Int);
                statement.prepare('EXEC addMaaltijd @accountID, @huisID, @naam, @beschrijving, @ingredienten, @allergie, @prijs;').then(s => {
                    s.execute({
                        accountID: req.header.tokenid,
                        huisID: huisId,
                        naam: naam,
                        beschrijving: beschrijving,
                        ingredienten: ingredienten,
                        allergie: allergie,
                        prijs: prijs
                    }).then(result => {
                        s.unprepare();

                        const records = result.recordset;
                        if(records[0].result !== -1) {
                            res.status(200).json(result.recordset[0]).end();
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
