/*
    deelnemer_routes.js   -   Routing the requests for deelnemer
 */

//Require for the express module
const express = require('express');
const deelnemer_controller = require('../controllers/deelnemer_controller');

//Creating the express Router
let routes = express.Router();

//The GET deelnemer request
routes.get('/studentenhuis', deelnemer_controller.getDeelnemerList);

//The POST deelnemer request
routes.post('/studentenhuis', deelnemer_controller.createDeelnemer);

//The DELETE deelnemer request
routes.delete('studentenhuis:huisId', deelnemer_controller.deleteDeelnemer);


module.exports = routes;

