class ApiError {
    constructor(status, message) {
        this.status = status;
        this.message = message;
        this.datetime = Date();
    }
}

module.exports = ApiError;