const express = require('express');
const router = express.Router();
const { resetGet, resetPost, resetToken, resetPasswordPost } = require('../controller/resetController');

router.get('/reset', resetGet)
router.post("/reset", resetPost)
router.get('/reset/:token', resetToken)
router.post('/resetPassword', resetPasswordPost)

module.exports = router;