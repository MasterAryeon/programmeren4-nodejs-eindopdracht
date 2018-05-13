const express = require('express');
const AuthController = require('../controllers/auth_controller');
let routes = express.Router();

// The router endpoints that we provide
routes.post('/login', AuthController.login);
routes.post('/register', AuthController.register);
routes.post('/hash', AuthController.hashPassword);

// Export the routes
module.exports = routes;