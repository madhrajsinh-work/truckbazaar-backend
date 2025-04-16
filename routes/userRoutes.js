const express = require('express');
const router = express.Router();
const { userApi } = require('../controllers/userController');

router.get('/user', userApi);

module.exports = router;
