const router = require('express').Router();
const { createLike, fetchAllLikesForATwit, deleteLike } = require('../../controllers/likes/likes.controller');
const auth = require("../../middleware/auth");

router.post('/:post_id/likes', auth.verifyToken, createLike);

router.get('/:post_id/likes', auth.verifyToken, fetchAllLikesForATwit);

router.delete('/:post_id/likes/:like_id', auth.verifyToken, deleteLike);

module.exports = router;