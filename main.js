const express = require('express')
const bodyParser = require("body-parser")
const mongoose = require("mongoose")
const Task = require('./models/task')
const path = require('path')
require("dotenv").config();

const tasks = require('./routes/tasks')
const { updateOne } = require('./models/task')
const app = express()

const nodeSass = require('node-sass-middleware')
app.use(nodeSass({
    src: path.join(__dirname, "scss"),
    dest: path.join(__dirname, "/public/style")
}))

app.use(express.json())
app.use(express.static(__dirname + "/public"))
app.use(bodyParser.urlencoded({ extended: false }))
app.use('/', tasks);

app.set("view engine", "ejs")

app.get("/", async (req, res) => {
    const data = await Task.find() //hämta vår data från DB
    res.render("index.ejs", { data: data }) //skicka till ejs
})

app.post("/", async (req, res) => { //add task

    console.log(req.body.name)
    await new Task({
        name: req.body.name
    }).save()

    res.redirect("/")
})

app.get("/edit/:id", async (req, res) => { //edit task

    const task = await Task.findOne({ _id: req.params.id })

    res.render("edit.ejs", { task: task })
})

app.post("/edit", async (req, res) => { //edit task
    await Task.updateOne({ _id: req.body.id }, {
        name: req.body.name
    })

    res.redirect("/")
})

app.get("/delete/:id", async (req, res) => {  //delete task

    await Task.deleteOne({ _id: req.params.id }).catch(err => { console.log("failed to delete") })

    res.redirect("/")
})

//connection string
mongoose.connect(process.env.DATABASE_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}, (err) => {
    console.log(err)
    if (err) return;
    console.log("Connected to DB")

    app.listen(process.env.PORT || 8080, (err) => {
        console.log("app körs i 8000")
    })
})