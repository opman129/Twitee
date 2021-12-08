const User = require('../../models/user/user.model');
const responseHandler = require('../../../utils/responseHandler');
const AppError = require('../../../utils/AppError');
const Email = require('../../../utils/Email');
const auth = require('../../middleware/auth');
const { catchAsync } = require('../../../utils/catchAsync');

/** Register New User */
module.exports.registerUser = catchAsync( async (req, res, next) => {
    const { name, email, password } = req.body;

    const user = await User.create({ name, email, password });
    const url = `${req.protocol}://${req.get('host')}/me`;

    /** Send Onboarding Email To User */
    await new Email(user, url).sendWelcome();
    const message = "User created successfully";
    delete user.password;

    return responseHandler(res, user, next, 201, message, 1);
});

/** Login a User */
module.exports.loginUser = catchAsync( async (req, res, next) => {
    const { email, password } = req.body;
    if (!email || !password) 
    return next(new AppError("Please provide your email and password"));

    const filterFields = ["+password"];

    const user = await User.findOne({ email }).select(filterFields).lean();
    const isPassword = user ? await auth.isPassword(password, user.password) : false;

    if (!user || !isPassword)
    return next(new AppError('Incorrect Email or Password', 401));

    delete user.password;
    req.user = user;
    return next();
});

/** Log-out User */
module.exports.logoutUser = catchAsync( async(req, res, next) => {
    res.clearCookie('jwt');
    next();
});