const express = require('express');
const router = express.Router();
const { register, login, verifyEmail , profile , resendCode} = require('../controllers/authController');
const auth = require('../middleware/authMiddleware');

router.post('/register', register);
router.post('/verify-email', verifyEmail);
router.post('/resend-code', resendCode);
router.post('/login', login);
router.get('/profile',auth, profile);

module.exports = router;