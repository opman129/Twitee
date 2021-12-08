const mongoose = require('mongoose')
const { isEmail } = require('validator');
const auth = require('../../middleware/auth');

const userSchema = mongoose.Schema({
    name: {
        type: String,
        trim: true,
        minLength: [5, 'Your name must be greater than 5 letters'],
        maxLength: [25, 'Your name cannot exceed 25 characters'],
        required: [true, 'Please ensure to input your name']
    },
    email: {
        type: String,
        required: [true, 'Please ensure to input your name'],
        validate: [isEmail, 'Please enter a valid email'],
        unique: true
    },
    password: {
        type: String,
        minLength: [5, "Password must be greater than 5 characters"],
        maxLength: [100, "Password cannot be greater than 12 characters"],
        required: [true, "Please enter your password"],
        select: false,
    },
}, { timestamps: true });

userSchema.index({ name: 1 });

userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next();
    this.password = await auth.hashPassword(this.password);
    next();
});

if (!userSchema.options.toObject) userSchema.options.toObject = {};
userSchema.options.toObject.transform = function (doc, ret, options) {
  delete ret.password;
}

const User = mongoose.model("User", userSchema);
module.exports = User;