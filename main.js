const express = require('express')
const bodyParser = require("body-parser")
const nodeSass = require('node-sass-middleware')
const mongoose = require("mongoose")
const path = require('path')
require("dotenv").config();

const routes = require('./routes/tasks')
const app = express()

app.use(nodeSass({
    src: path.join(__dirname, "scss/"),
    dest: path.join(__dirname, "public/style")
}))

app.use(express.json())
app.use(express.static(__dirname + "/public"))
app.use(bodyParser.urlencoded({ extended: false }))
app.use('/', routes);

app.set("view engine", "ejs")

mongoose.connect(process.env.DATABASE_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}, (err) => {
    if (err) console.log(err).return;
    console.log("Connected to DB")

    app.listen(process.env.PORT || 8080, (err) => {
        console.log("app körs i 8000")
        if (err) console.log(err).return;
    })
})
