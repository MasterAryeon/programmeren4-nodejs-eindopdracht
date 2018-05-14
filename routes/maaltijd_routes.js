/*
    maaltijd_routes.js   -   Routing the requests for maaltijd
 */

//Require for the express module
const express = require('express');
const maaltijd_controller = require('../controllers/maaltijd_controller');

//Creating the express Router
let routes = express.Router();

//The GET maaltijd request
routes.get('/studentenhuis:huisId/maaltijd', maaltijd_controller.getMaaltijdList);

//The POST studentenhuis request
routes.post('/studentenhuis:huisId/maaltijd', maaltijd_controller.createStudentenhuis);

//The GET maaltijd by Id request
routes.get('/studentenhuis:huisId/maaltijd:maaltijdId', maaltijd_controller.getMaaltijdById());

//The PUT maaltijd by Id request
routes.put('/studentenhuis:huisId/maaltijd:maaltijdId', maaltijd_controller.putMaaltijdById);

//The DELETE maaltijd by Id request
routes.delete('/studentenhuis:huisId/maaltijd:maaltijdId', maaltijd_controller.deleteMaaltijdById);


module.exports = routes;

