const { registerUser, loginUser, logoutUser } = require('../../controllers/user/user.controller');
const router = require('express').Router();
const auth = require('../../middleware/auth');

/** Register A New User */
router.post('/register', registerUser);

/** Login A New User */
router.post('/login', loginUser, auth.signToken, auth.addToken);

/** Logout A User */
router.get('/logout', auth.verifyToken, logoutUser, auth.logout);

module.exports = router;