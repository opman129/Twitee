const express = require('express');
const app = express();
const path = require('path');
const cors = require('cors');
const rateLimit = require("express-rate-limit");
const helmet = require('helmet');
const cookieParser = require('cookie-parser');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const hpp = require('hpp');
const compression = require('compression');
const router = require('./apiV1/routes/index');
const globalErrorHandler = require('./helpers/globalErrorHandler');

app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));

/** Set Security HTTP headers */
app.use(helmet());
app.use(express.urlencoded({ extended: false }));

/** Middlewares */
app.use(express.json({ limit: '20000kb' }));
app.use(cors());
app.use("*", cors());
app.set('trust proxy', true);

/** Rate Limiting Middleware */
const limiter = rateLimit({
    windowMs: 60 * 60 * 1000, /** 1 hour - 1000 * 60 = 1 minute in Javascript */
    max: 100 // Limit each IP to 100 requests per windowMs
});

app.use('/v1', limiter);
app.use(cookieParser());
app.use(mongoSanitize());
app.use(xss());
app.use(compression());

/** Prevent Parameter Pollution - Use on Fields in Schema Definition */
app.use(hpp({
    whitelist: ['post'],
}));

app.use(router);

/** Global Error Handler */
app.use(globalErrorHandler);

module.exports = { app };