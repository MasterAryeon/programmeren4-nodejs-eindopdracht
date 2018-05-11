/*
    server.js   -   Main server file
 */

// Initiating all the neccessary variables
const express = require('express');
const bodyparser = require('body-parser');
const morgan = require('morgan');

// Initializing the database connection
const sql = require('./config/db');

// Include all configs
const config = require("./config/config");

// Deeper initiation
const app = express();
const port = process.env.PORT || config.port;

// Tell the express system to use morgan and bodyparser
app.use(morgan('dev'));
app.use(bodyparser.json());

// Start the server on given port
app.listen(port, () => {
    console.log('Server is running on port: ' + port);
});