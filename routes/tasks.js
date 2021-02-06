const express = require('express');
const router = express.Router();
const mongoose = require("mongoose")
const Task = require('../models/task');

router.get('/', async (req, res) => {
    const sorted = +req.query.page;

    try {
        const data = await Task.find()/*.sort({ name: page })*/
        res.render('index.ejs', { data, error: "empty" })
    }
    catch (err) {
        res.render("error.ejs", { error: err })
    }
})

router.post('/', async (req, res) => {
    try {
        console.log(req.body.name)
        await new Task({
            name: req.body.name
        }).save()
        res.redirect("/")
    }
    catch (err) {
        console.log(err)
        res.render("error.ejs", { error: err })
    }
})

module.exports = router;