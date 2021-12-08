const Post = require('../../models/posts/post.model');
const responseHandler = require('../../../utils/responseHandler');
const AppError = require('../../../utils/AppError');
const { catchAsync } = require('../../../utils/catchAsync');

/** Create A Post */
module.exports.createPost = catchAsync( async(req, res, next) => {
    const { post } = req.body;
    const user = req.user.id;

    const newPost = await Post.create({ post, user });
    const message = 'Twit created successfully';
    return responseHandler(res, newPost.toObject(), next, 201, message, 1);
});

/** Fetch All Posts */
module.exports.fetchPosts = catchAsync ( async(req, res, next) => {
    const posts = await Post.find().sort('-createdAt').lean();
    const message = "Twits retrieved successfully";
    return responseHandler(res, posts, next, 200, message, posts.length);
});

/** Delete Post */
module.exports.deletePost = catchAsync( async(req, res, next) => {
    const { post_id } = req.params;
    const post = await Post.findByIdAndDelete(post_id);

    if (!post) return next(new AppError("Twit with given Id not found", 404));
    const message = "Twit deleted successfully";
    return responseHandler(res, null, next, 200, message);
});