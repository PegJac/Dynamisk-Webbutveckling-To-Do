const express = require('express');
const router = express.Router();
const Task = require('../models/task');
const verify = require('../middleware/verifyUser')
const { startTask, taskGet, taskPost, editGet, editPost, taskDelete } = require('../controller/taskController')

router.get('/', startTask)

router.get('/main', verify, taskGet).post('/main', verify, taskPost)

router.get("/edit/:id", verify, editGet)

router.post("/edit", verify, editPost)

router.get('/delete/:id', verify, taskDelete)

module.exports = router;