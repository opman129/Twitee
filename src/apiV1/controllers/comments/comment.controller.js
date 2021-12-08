const Comment = require('../../models/comments/comment.model');
const responseHandler = require('../../../utils/responseHandler');
const AppError = require('../../../utils/AppError');
const { catchAsync } = require('../../../utils/catchAsync');
const Post = require('../../models/posts/post.model');

/** Create A New Comment For A Post */
module.exports.createComment = catchAsync (async (req, res, next) => {
    const { post_id } = req.params;
    const post = await Post.findById(post_id);
    const user = req.user._id;
    const { comment } = req.body;

    if (!post) return next(new AppError("Twit with the given Id does not exist"));
    const newComment = await Comment.create({ post, user, comment });
    const message = 'Comment created for Twit successfully';
    return responseHandler(res, newComment, next, 201, message, 1);
});

/** Fetch All Comments */
module.exports.fetchComments = catchAsync( async (req, res, next) => {
    const { post_id } = req.params;
    const post = await Post.findById(post_id).lean();
    if (!post) return next(new AppError("Post with the given Id not found"));
    const comments = await Comment.find({ post }).sort('-createdAt');

    const message = 'All comments for this Twit retrieved successfully';
    const record = comments.length;
    return responseHandler(res, comments, next, 200, message, record);
});

/** Delete Comment*/
module.exports.deleteComment = catchAsync( async (req, res, next) => {
    const { comment_id, post_id } = req.params;
    const post = await Post.findById(post_id).lean();
    if (!post) return next(new AppError("Twit with the given Id not found", 404));

    const comment = await Comment.findByIdAndDelete(comment_id);
    if (!comment) return next(new AppError("Comment with the given Id not found", 404));
    return responseHandler(res, null, next, 200, "Comment for this Twit deleted successfully");
});
