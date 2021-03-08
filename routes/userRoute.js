
const express = require('express')
const mongoose = require('mongoose')
const User = require('../models/user')
const bcrypt = require('bcrypt')
const router = express.Router()
const error = []
const { loginGet, loginPost, registerGet, registerPost, logoutPost } = require('../controller/userController')

router.get('/login', loginGet).post('/login', loginPost)

router.get('/register', registerGet).post('/register', registerPost)

router.get('/logout', logoutPost)

module.exports = router;