const { errorResponse } = require('../utils/responseUtils');

// Global error handling middleware
const errorHandler = (err, req, res, next) => {
  console.error('Error:', err);

  // Mongoose validation error
  if (err.name === 'ValidationError') {
    const errors = Object.values(err.errors).map(e => e.message);
    return errorResponse(res, 'Validation Error', 400, errors);
  }

  // Mongoose duplicate key error
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue)[0];
    const message = `${field} already exists`;
    return errorResponse(res, message, 400);
  }

  // Mongoose cast error
  if (err.name === 'CastError') {
    return errorResponse(res, 'Invalid resource ID', 400);
  }

  // JWT error
  if (err.name === 'JsonWebTokenError') {
    return errorResponse(res, 'Invalid token', 401);
  }

  // JWT expired error
  if (err.name === 'TokenExpiredError') {
    return errorResponse(res, 'Token expired', 401);
  }

  // Default server error
  return errorResponse(res, 'Internal Server Error', 500);
};

// Handle 404 errors
const notFound = (req, res, next) => {
  errorResponse(res, `Route ${req.originalUrl} not found`, 404);
};

// Handle validation errors
const validationError = (errors) => {
  return (req, res, next) => {
    return errorResponse(res, 'Validation failed', 400, errors);
  };
};

module.exports = {
  errorHandler,
  notFound,
  validationError
};