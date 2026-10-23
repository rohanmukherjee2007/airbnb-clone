class NotFoundError extends Error {
    constructor(message) {
        super(message);
        this.statusCode = 404;
        this.name = "NotFoundError";
    }
}

class SchemaValidationError extends Error {
    constructor(message, statusCode, schema) {
        super(message);
        this.statusCode = statusCode;
        const fieldDict = {
            "title": "TitleValidationError",
            "price": "InvalidPriceError",
            "location": "LocationNotFoundError",

        };
        this.name = fieldDict[schema];
    }
}

export { NotFoundError, SchemaValidationError };
