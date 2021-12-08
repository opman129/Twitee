const { registerUser, loginUser, logoutUser } = require('../../controllers/user/user.controller');
const router = require('express').Router();
const auth = require('../../middleware/auth');

router.post('/register', registerUser);
router.post('/login', loginUser, auth.signToken, auth.addToken);
router.get('/logout', auth.verifyToken, logoutUser, auth.logout);

module.exports = router;