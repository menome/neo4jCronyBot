/**
 * Copyright (C) 2018 Menome Technologies.
 *
 * Logging code!
 */
var winston = require('winston');

const logger = winston.createLogger({
  level: 'verbose',
  format: winston.format.simple(),
  transports: [
    new winston.transports.File({ filename: 'logs/errors.log', level: 'error', format: winston.format.combine(
      winston.format.timestamp(),
      winston.format.json()
    )}),
    new winston.transports.File({ filename: 'logs/results.log', level: 'verbose', format: winston.format.combine(
      winston.format.timestamp(),
      winston.format.json()
    )})
  ]
})

logger.add(new winston.transports.Console({level: 'info'}));

module.exports = logger;