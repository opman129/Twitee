const Like = require('../../models/likes/likes.model');
const responseHandler = require('../../../utils/responseHandler');
const AppError = require('../../../utils/AppError');
const { catchAsync } = require('../../../utils/catchAsync');
const Post = require('../../models/posts/post.model');

/** Create Like for Twit */
module.exports.createLike = catchAsync (async (req, res, next) => {
    const { like } = req.body;
    const { post_id } = req.params;
    const creator = req.user._id;

    const post = await Post.findById(post_id).lean();
    if (!post) return next(new AppError("Twit with the given Id does not exist anymore"));

    const newLike = await Like.create({ like, post, creator });
    const message = "Twit liked successfully";
    return responseHandler(res, newLike, next, 201, message, 1);
});

/** Fetch All Likes For A Particular Post */
module.exports.fetchAllLikesForATwit = catchAsync( async(req, res, next) => {
    const { post_id } = req.params;
    const post = await Post.findById(post_id).lean();
    if (!post) return next(new AppError("Twit with the given Id does not exist anymore"));

    const likes = await Like.find({ post }).lean();
    const message = "Likes retrieved successfully";
    const record = likes.length;
    return responseHandler(res, likes, next, 200, message, record);
});

module.exports.deleteLike = catchAsync( async (req, res, next) => {
    const { post_id, like_id } = req.params;
    const post = await Post.findById(post_id).lean();
    if (!post) return next(new AppError("Twit with the given Id does not exist anymore"));

    const like = await Like.findByIdAndDelete(like_id)
    if (!like) return next(new AppError("Like with the given Id does not exist anymore"));
    const message = 'Like Deleted Successfully';
    return responseHandler(res, null, next, 200, message);
});
