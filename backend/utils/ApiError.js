class ApiError extends Error {
  constructor(code, message, isOperational = true) {
    super(message);
    this.code = code;
    this.isOperational = isOperational;
  }
}

module.exports = ApiError;
