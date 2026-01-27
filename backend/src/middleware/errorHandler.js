export const errorHandler = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  // Log error for debugging
  console.error('ERROR 💥:', err);

  if (process.env.NODE_ENV === 'development') {
    res.status(err.statusCode).json({
      success: false,
      error: {
        message: err.message,
        stack: err.stack,
        error: err,
      },
    });
  } else {
    // Production: Send clean error message
    if (err.isOperational) {
      res.status(err.statusCode).json({
        success: false,
        error: {
          message: err.message,
        },
      });
    } else {
      // Programming or unknown error: don't leak error details
      res.status(500).json({
        success: false,
        error: {
          message: 'Something went wrong!',
        },
      });
    }
  }
};
