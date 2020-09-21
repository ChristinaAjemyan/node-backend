require('express-async-errors');
const winston = require('winston');

module.exports = function () {
  winston.exceptions.handle(
    new winston.transports.File({ filename: 'logs/unhandled.log' })
  );
  const files = new winston.transports.File({ filename: 'logs/logfile.log' });
  winston.add(files);

};
