const CustomApiError = require('../errors/CustomApiError');
const { StatusCodes } = require('http-status-codes');

const errorHandlerMiddleware = (err, req, res, next) => {
  const customError = {
    statusCode: err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR,
    message: err.message || 'Oops! something happened. Try later'
  };

  if (err instanceof CustomApiError) {
    return res.status(err.statusCode).json(err.message);
  }

  if (err.code && err.code === 11000) {
    customError.statusCode = StatusCodes.BAD_REQUEST;
    const field = Object.keys(err.keyValue)[0];
    customError.message = `${err.keyValue[field]} already exists. Please choose another ${field}`;
    return res
      .status(customError.statusCode)
      .json({ msg: customError.message });
  }

  if (err.name === 'ValidationError') {
    customError.message = Object.values(err.errors)
      .map((error) => error.message)
      .join('');
    customError.statusCode = StatusCodes.BAD_REQUEST;
    return res
      .status(customError.statusCode)
      .json({ msg: customError.message });
  }

  if (err.name === 'CastError') {
    customError.message = `no item found with id: ${err.value}`;
    customError.statusCode = StatusCodes.NOT_FOUND;
    return res
      .status(customError.statusCode)
      .json({ msg: customError.message });
  }

  return res.status(customError.statusCode).json(customError.message);
};

module.exports = errorHandlerMiddleware;
