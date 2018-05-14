/*
    studentenhuis_routes.js   -   Routing the requests for studentenhuis
 */

//Require for the express module
const express = require('express');
const studentenhuis_controller = require('../controllers/studentenhuis_controller');

//Creating the express Router
let routes = express.Router();

//The GET studentenhuis request
routes.get('/studentenhuis', studentenhuis_controller.getStudentenhuisList);

//The POST studentenhuis request
routes.post('/studentenhuis', studentenhuis_controller.createStudentenhuis);

//The GET studentenhuis by Id request
routes.get('/studentenhuis:huisId', studentenhuis_controller.getStudentenhuisById());

//The PUT studentenhuis by Id request
routes.put('studentenhuis:huisId', studentenhuis_controller.putStudentenhuisById);

//The DELETE studentenhuis by Id request
routes.delete('studentenhuis:huisId', studentenhuis_controller.deleteStudentenhuisById);


module.exports = routes;

