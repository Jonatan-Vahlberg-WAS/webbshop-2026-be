const errorHandler = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.message = err.message || 'Somthing went wrong';

  res.status(err.statusCode).json({
    status: err.status || 'error',
    message: err.message,
  });
};

export default errorHandler;
