const express = require('express');
const ErrorController = require('../controllers/error_controller');
let routes = express.Router();

//Telling the router to use the given endpoint
routes.use(ErrorController.endpointNotFound);

// Exporting the routes so they can be used by the other classes
module.exports = routes;