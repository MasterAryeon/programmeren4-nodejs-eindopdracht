const ApiError = require('../domain/ApiError');
const chalk = require('chalk');

module.exports = {
    endpointNotFound(request, response, next) {
        //Sending errors info to the Final errors Handler
        next(new ApiError(404, 'Endpoint could not be found'));
    },
    errorHandling(error, request, response, next) {
        console.log(chalk.red('[ERROR]  An ' + error.status + ' error has occured: ' + error.message));

        response.status(error.status).json(error).end();
    }
};