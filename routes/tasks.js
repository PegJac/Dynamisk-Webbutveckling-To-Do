const express = require('express');
const router = express.Router();
const mongoose = require("mongoose")
const Task = require('../models/task');

router.get('/', async (req, res) => {
    const sort = + req.query.sort || 1
    const page = + req.query.page || 1

    try {
        const numberOfTasks = await Task.find().countDocuments();
        const numberOfTasksToDisplayPerReq = 5;
        const numberOfPages = Math.ceil(numberOfTasks / numberOfTasksToDisplayPerReq)
        const dataToShow = numberOfTasksToDisplayPerReq * page

        const data = await Task.find().limit(dataToShow).sort({ date: sort })
        res.render('index.ejs', {
            data,
            error: "empty",
            numberOfTasks,
            numberOfTasksToDisplayPerReq,
            numberOfPages,
            dataToShow
        })
    }
    catch (err) {
        res.render("index.ejs", { error: err })
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
        const sort = + req.query.sort || 1
        const page = + req.query.page || 1

        const numberOfTasks = await Task.find().countDocuments();
        const numberOfTasksToDisplayPerReq = 5;
        const numberOfPages = Math.ceil(numberOfTasks / numberOfTasksToDisplayPerReq)
        const dataToShow = numberOfTasksToDisplayPerReq * page

        const data = await Task.find().limit(dataToShow).sort({ date: sort })

        console.log(err)
        res.render("index.ejs", {
            error: err,
            data,
            numberOfTasks,
            numberOfTasksToDisplayPerReq,
            numberOfPages,
            dataToShow
        })
    }
})

router.get("/edit/:id", async (req, res) => {
    try {
        const sort = + req.query.sort || 1
        const page = + req.query.page || 1

        const numberOfTasks = await Task.find().countDocuments();
        const numberOfTasksToDisplayPerReq = 5;
        const numberOfPages = Math.ceil(numberOfTasks / numberOfTasksToDisplayPerReq)
        const dataToShow = numberOfTasksToDisplayPerReq * page


        const data = await Task.find()
        const editTask = await Task.findById({ _id: req.params.id })
        res.render("edit.ejs", {
            editTask,
            error: "empty",
            data,
            numberOfTasks,
            numberOfTasksToDisplayPerReq,
            numberOfPages,
            dataToShow
        })
    } catch (err) {
        res.render("index.ejs", { error: err })
    }
})

router.post("/edit", async (req, res) => {
    try {
        console.log(req.body)
        await Task.updateOne({ _id: req.body.id }, {
            name: req.body.name
        })
        res.redirect("/")

    } catch (err) {
        res.render("edit.ejs", { error: err })
    }
})

router.get('/delete/:id', async (req, res) => {
    try {
        const data = await Task.deleteOne({ _id: req.params.id })
        res.redirect("/")
    }
    catch (err) {
        res.render("index.ejs", { error: err })
    }
})

module.exports = router;