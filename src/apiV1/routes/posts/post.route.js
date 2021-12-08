const { createPost, fetchPosts, deletePost } = require('../../controllers/posts/post.controller');
const router = require('express').Router();
const { checkIfUserIsPostCreator } = require('../../middleware/permissions');
const auth = require('../../middleware/auth');

router.post('/', auth.verifyToken, createPost)

router.get('/', auth.verifyToken, fetchPosts);
    
router.delete('/:post_id', auth.verifyToken, checkIfUserIsPostCreator, deletePost);

module.exports = router;