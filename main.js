const express = require('express')
const bodyParser = require("body-parser")
const mongoose = require("mongoose")
const Task = require('./models/task')

const tasks = require('./routes/tasks')
const app = express()

app.use(express.json())
app.use(express.static(__dirname + "/public"))
app.use(bodyParser.urlencoded({ extended: false }))
app.use('/routes/tasks', tasks);

app.set("view engine", "ejs")

app.get("/", async (req, res) => {

    const data = await Task.find()

    res.render("index.ejs", { data: data })
})

app.post("/", async (req, res) => {
    console.log(req.body.name)

    await new Task({
        name: req.body.name
    }).save()

    res.redirect("/")
})

mongoose.connect("mongodb+srv://peggyj:MangoMania69@cluster0.bphuo.mongodb.net/toDoDB?retryWrites=true&w=majority", {
    useNewUrlParser: true,
    useUnifiedTopology: true
}, (err) => {
    console.log(err)
    if (err) return;
    console.log("Connected to DB")

    app.listen(8000, (err) => {
        console.log("app körs i 8000")
    })
})