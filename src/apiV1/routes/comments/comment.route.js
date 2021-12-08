const { createComment, fetchComments, deleteComment } = require('../../controllers/comments/comment.controller');
const router = require('express').Router();
const auth = require("../../middleware/auth");
const { checkIfUserIsCommentCreator } = require('../../middleware/permissions');

/**Create Comment For Post */
router.post('/:post_id/comments', auth.verifyToken, createComment);

/** Fetch All comments for a particular post */
router.get('/:post_id/comments', auth.verifyToken, fetchComments);

/** Delete comment for a post */
router.delete('/:post_id/comments/:comment_id', auth.verifyToken, checkIfUserIsCommentCreator, deleteComment);

module.exports = router;