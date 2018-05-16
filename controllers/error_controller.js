const ApiError = require('../domain/ApiError');
const chalk = require('chalk');

module.exports = {
    // function used for processing a non existing endpoint
    endpointNotFound(request, response, next) {
        //Sending errors info to the Final errors Handler
        next(new ApiError(404, 'Endpoint could not be found'));
    },
    // function used for processing errors
    errorHandling(error, request, response, next) {
        console.log(chalk.red('[ERROR]  An ' + error.status + ' error has occured: ' + error.message));

        response.status(error.status).json(error).end();
    }
};