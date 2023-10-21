function ApiError(statusCode, message, stack) {
  Error.call(this);
  this.statusCode = statusCode;
  this.message = message || "An error occurred";
  this.stack = stack || new Error().stack;
}

ApiError.prototype = Object.create(Error.prototype);
ApiError.prototype.constructor = ApiError;

module.exports = ApiError;
