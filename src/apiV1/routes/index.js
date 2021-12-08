const router = require('express').Router();
const AppError = require('../../utils/AppError');
const users = require('./user/user.route');
const posts = require('./posts/post.route');
const comments = require('./comments/comment.route');
const likes = require('./likes/likes.route');

router.use('/users', users);
router.use('/posts', posts);
router.use('/posts', comments);
router.use('/posts', likes);

/** -------- Base API Route ----------- */
router.get('/', (req, res) => {
    res.status(200).json({
        status: 'success',
        message: 'Welcome, A world of awesomeness awaits'
    });
});

router.all('*', (req, res, next) => {
    next(new AppError(`${req.originalUrl} was not found on this platform`, 404));
});

module.exports = router;