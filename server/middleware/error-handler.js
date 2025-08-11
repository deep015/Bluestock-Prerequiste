// File: /backend/src/middleware/error-handler.js

const { StatusCodes } = require("http-status-codes");

const errorHandlerMiddleware = (err, req, res, next) => {
  // Log the error for server-side debugging
  console.error('❌ An error occurred:', err);

  // Default error properties
  let customError = {
    statusCode: err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR,
    message: err.message || 'Something went wrong, please try again later.',
  };

  // If the error is an instance of a CustomAPIError (or has a statusCode property),
  // use its properties. This avoids the instanceof TypeError.
  if (err.statusCode) {
    customError.statusCode = err.statusCode;
    customError.message = err.message;
  }

  // Handle common database or validation errors
  // Example for a specific error from your database
  if (err.name === 'ValidationError') {
    customError.message = Object.values(err.errors)
      .map((item) => item.message)
      .join(', ');
    customError.statusCode = StatusCodes.BAD_REQUEST;
  }
  
  if (err.code && err.code === 11000) {
    customError.message = `Duplicate value entered for ${Object.keys(err.keyValue)} field, please choose another value.`;
    customError.statusCode = StatusCodes.BAD_REQUEST;
  }
  
  // Return a JSON response with the error details
  return res.status(customError.statusCode).json({ msg: customError.message });
};

module.exports = errorHandlerMiddleware;
