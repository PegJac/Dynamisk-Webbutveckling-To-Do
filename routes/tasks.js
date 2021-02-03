const express = require('express');
const task = require('../models/task');
const router = express.Router();

const Task = require('../models/task');

router.get('/', (req, res) => {
    res.send("Hej")
})

router.post('/', (req, res) => {
    const newTask = new Task({
        name: req.body.name
    })
    newTask.save()
        .then(task => res.json(task));
})

module.exports = router;