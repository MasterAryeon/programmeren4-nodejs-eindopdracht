/*
    deelnemer_routes.js   -   Routing the requests for deelnemer
 */

//Require for the express module
const express = require('express');
const deelnemer_controller = require('../controllers/deelnemer_controller');

//Creating the express Router
let routes = express.Router();

//The GET deelnemer request
routes.get('/:id/maaltijd/:maaltijdId/deelnemers', deelnemer_controller.getDeelnemerList);

//The POST deelnemer request
routes.post('/:id/maaltijd/:maaltijdId/deelnemers', deelnemer_controller.createDeelnemer);

//The DELETE deelnemer request
routes.delete('/:id/maaltijd/:maaltijdId/deelnemers', deelnemer_controller.deleteDeelnemer);


module.exports = routes;

