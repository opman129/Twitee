const { createComment, fetchComments, deleteComment } = require('../../controllers/comments/comment.controller');
const router = require('express').Router();
const auth = require("../../middleware/auth");

router.post('/:post_id/comments', auth.verifyToken, createComment);
router.get('/comments', auth.verifyToken, fetchComments);
router.delete('/:post_id/comments/:comment_id', auth.verifyToken, deleteComment);

module.exports = router;