const fs = require('fs');
const winston = require('winston');
const winstonDaily = require('winston-daily-rotate-file');

/** Logs Directory */
const logDir = __dirname + '/../../logs';

if (!fs.existsSync(logDir)) fs.mkdirSync(logDir);

/** Winston Format */
const { combine, timestamp, printf } = winston.format;

/** Define Log Format */
const logFormat = printf(({ timestamp, level, message }) => 
    `${timestamp} ${level}: ${JSON.stringify(message, null, 2)}`)

/**
 * Log Level
 * error: 0, warn: 1, info: 2, http: 3, verbose: 4, debug: 5, silly: 6
 */
const logger = winston.createLogger({
    format: combine(
        timestamp({
            format: 'YYYY-MM-DD HH:mm:ss a'
        }),
        logFormat,
    ),
    transports: [
        new winstonDaily({
            level: 'info',
            datePattern: 'YYYY-MM-DD',
            dirname: logDir + '/info',
            filename: `%DATE%.log`,
            maxFiles: 30,
            json: false,
            zippedArchive: true,
        }),
        new winstonDaily({
            level: 'error',
            datePattern: 'YYYY-MM-DD',
            dirname: logDir + '/error', // log file /logs/error/*.log in save
            filename: `%DATE%.error.log`,
            maxFiles: 30, // 30 Days saved
            handleExceptions: true,
            json: false,
            zippedArchive: true,
        }),
    ],
});

logger.add(
    new winston.transports.Console({
        format: winston.format.combine(winston.format.splat(), winston.format.colorize(), logFormat),
    }),
);

const stream = {
    write: (message) => {
        logger.info(message.substring(0, message.lastIndexOf('\n')));
    },
};
logger.info(logDir);

module.exports = { logger, stream };
