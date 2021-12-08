const { createPost, fetchPosts, deletePost } = require('../../controllers/posts/post.controller');
const router = require('express').Router();
const { checkIfUserIsPostCreator } = require('../../middleware/permissions');
const auth = require('../../middleware/auth');

/** Create A Post (Twit) */
router.post('/', auth.verifyToken, createPost)

/** Fetch All Twits */
router.get('/', auth.verifyToken, fetchPosts);
    
/** Delete a Post (Twit) */
router.delete('/:post_id', auth.verifyToken, checkIfUserIsPostCreator, deletePost);

module.exports = router;