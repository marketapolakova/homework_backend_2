"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var ErrorResponse = /** @class */ (function () {
    function ErrorResponse(status, errors) {
        this.status = status;
        this.errors = errors;
    }
    return ErrorResponse;
}());
exports.default = ErrorResponse;
