/*
    PLACEHOLDER_routes.js   -   Routing the requests
 */

//Require for the express module
const express = require('express');
const PLACEHOLDERController = require('../controllers/PLACEHOLDER_controller');

//Creating the express Router
let routes = express.Router();

//The GET personList request
routes.get('/PLACEHOLDER', PLACEHOLDERController.getPLACEHOLDER);

