/*
    deelnemer_controller.js   -   Controller for the requests for deelnemer
 */

const sql = require('mssql');
const assert = require('assert');
const config = require('../config/config');
const ApiError = require('../domain/ApiError');
const chalk = require('chalk');

module.exports = {

    getDeelnemerList(request, response, next){
        console.log('---------------A GET request was made---------------');
        console.log('-------------------GET deelnemer--------------------');
        try {
            const huisId = request.params.id || -1;
            const maaltijdId = request.params.maaltijdId || -1;

            assert(huisId >= 0, 'Een of meer properties in de request body ontbreken of zijn foutief');
            assert(maaltijdId >= 0, 'Een of meer properties in de request body ontbreken of zijn foutief');

            const connection = new sql.ConnectionPool(config.sql);
            connection.connect().then(conn => {

                const statement = new sql.PreparedStatement(conn);
                statement.input('huisID',sql.Int);
                statement.input('maaltijdID',sql.Int);
                statement.prepare('EXEC getDeelnemersFromMaaltijdId @huisID, @maaltijdID;').then(s => {
                    s.execute({
                        huisID: huisId,
                        maaltijdID: maaltijdId
                    }).then(result => {
                        s.unprepare();
                        console.log(result);
                        if(result.recordset.length !== 0) {
                            if ('result' in result.recordset[0]) {
                                if (result.recordset[0].result === -1) {
                                    next(new ApiError(404, 'Niet gevonden (huisId bestaat niet)'));
                                } else {
                                    next(new ApiError(404, 'Niet gevonden (maaltijdId bestaat niet)'));
                                }
                            } else {
                                response.status(200).json(result.recordset).end();
                            }
                        } else {
                            response.status(200).json([]).end();
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