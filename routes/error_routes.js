const express = require('express');
const ErrorController = require('../controllers/error_controller');
let routes = express.Router();

routes.use(ErrorController.endpointNotFound);

module.exports = routes;