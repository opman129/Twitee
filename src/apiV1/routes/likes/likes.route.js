const router = require('express').Router();
const { createLike, fetchAllLikesForATwit, deleteLike } = require('../../controllers/likes/likes.controller');
const auth = require("../../middleware/auth");

/** Create Like For Post */
router.post('/:post_id/likes', auth.verifyToken, createLike);

/** Fetch All Likes For Post */
router.get('/:post_id/likes', auth.verifyToken, fetchAllLikesForATwit);

/** Delete A Like For A Post */
router.delete('/:post_id/likes/:like_id', auth.verifyToken, deleteLike);

module.exports = router;