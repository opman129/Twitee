const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const responseHandler = require('../../utils/responseHandler');
const { promisify } = require('util');
const bcrypt = require('bcrypt');
const AppError = require('../../utils/AppError');
dotenv.config();

const SECRET = process.env.JWT_KEY;
const salt_rounds = parseInt(process.env.SALT_ROUNDS, 10) +3;

const auth = {

    async verifyToken(req, res, next) {
        try {
            const access = req.headers.authorization;

            let token;
            if (access && access.startsWith('Bearer')) {
                let bearerToken = access.split(' ');
                token = bearerToken[1];

            } else if (req.cookies && req.cookies.jwt) {
                token = req.cookies.jwt;
            }
            if (!token) return next(new AppError('Unauthorised. Please login with your details', 401))

            const decodedToken = await promisify(jwt.verify)(token, SECRET);

            const User = require('../models/user/user.model');
            const currentUser = await User.findOne({ _id: decodedToken._id }).select('+password');

            if (!currentUser) return next(new AppError('Unauthorized', 401))
            req.user = currentUser;
            req.decodedToken = decodedToken;
            return next();
        } catch (error) {
            console.log(error.name)
            if (error.name === 'TokenExpiredError' || error.name === 'JsonWebTokenError') {
                error.message = 'Unauthorised. Please login with your details';
                error.statusCode = 401;
            };
            typeof error === "object" ? error.statusCode = 401 : error = { message: error, statusCode: 401 };
            return next(error);
        }
    },

    signToken: async (req, res, next) => {
        try {
            const { _id, email } = req.user;
            const token = jwt.sign({ _id, email }, SECRET, { expiresIn: process.env.JWT_EXPIRATION_TIMEFRAME });
            req.token = token;
            next();
        } catch (error) {
            next(error);
        }
    },

    addToken(req, res, next) {
        try {
            const token = req.token;
            const cookieOptions = {
                httpOnly: true,
                expires: new Date(Date.now() + parseInt(process.env.JWT_EXPIRY_TIME, 10) * 1000 * 60 * 60 * 24)
            }
            cookieOptions.secure = req.secure || req.headers['x-forwarded-proto'] === 'https';

            if (process.env.NODE_ENV === 'production' && !cookieOptions.secure) {
                return next(new AppError('You cannot be logged in when your network connection is not secure!', 400))
            }
            const message = req.message || 'Successfully logged in'
            res.cookie('jwt', token, cookieOptions);
            return responseHandler(res, { token, ...req.user }, next, 200, message, 1);
        } catch (error) {
            return next(error);
        };
    },

    async hashPassword(password) {
        const hashedPassword = await bcrypt.hash(password, salt_rounds);
        return hashedPassword;
    },

    async isPassword(password, dbPassword) {
        const isPassword = await bcrypt.compare(password, dbPassword);
        return isPassword;
    },

    logout: (req, res, next) => {
        res.cookie('jwt', 'loggedOut', {
            httpOnly: true,
            expiresIn: new Date(Date.now() + (5 * 1000))
        });
        return res.status(200).json({
            status: 'success',
            message: 'Successfully logged out',
            token: null
        });
    },
}

module.exports = auth;