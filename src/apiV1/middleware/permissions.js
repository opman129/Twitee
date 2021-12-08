const mongoose = require('mongoose');
const AppError = require('../../utils/AppError');
const { catchAsync } = require('../../utils/catchAsync');
const Post = require('../models/posts/post.model');

exports.checkIfUserIsPostCreator = catchAsync( async (req, res, next) => {
    const query = { _id: req.params.post_id };
    const post = await Post.findOne(query);
    if (!post) return next(new AppError("Post with the given Id does not exist", 404));
    const creator = post.user.toString();

    if (req.user.id === creator) {
        return next();
    }; 

    return next(new AppError("You do not have the correct permissions to carry out this action", 403));
});