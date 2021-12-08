const { createComment, fetchComments, deleteComment } = require('../../controllers/comments/comment.controller');
const router = require('express').Router();
const auth = require("../../middleware/auth");
const { checkIfUserIsCommentCreator } = require('../../middleware/permissions');

router.post('/:post_id/comments', auth.verifyToken, createComment);
router.get('/:post_id/comments', auth.verifyToken, fetchComments);
router.delete('/:post_id/comments/:comment_id', auth.verifyToken, checkIfUserIsCommentCreator,  deleteComment);

module.exports = router;