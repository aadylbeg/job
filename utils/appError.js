class AppError extends Error {
  constructor(message, statusCode, err = null) {
    super(message);

    this.statusCode = statusCode;
    this.status = `${statusCode}`.startsWith("4") ? "fail" : "error";
    this.isOperational = true;

    Error.captureStackTrace(this, this.constructor);
    console.log(err);
  }
}

module.exports = AppError;
