class ErrorResponse extends Error {
    constructor(message, statusCode) {
        super(message);
        this.statusCode = statusCode;

        // Captura la traza del error manteniendo la referencia al constructor original
        Error.captureStackTrace(this, this.constructor);
    }
}

module.exports = ErrorResponse;
