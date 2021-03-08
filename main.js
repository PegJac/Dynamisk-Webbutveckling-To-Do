const express = require('express')
const bodyParser = require("body-parser")
const nodeSass = require('node-sass-middleware')
const cookieParser = require('cookie-parser')
const mongoose = require("mongoose")
const User = require('./models/user')
const path = require('path')
require("dotenv").config();

const taskRoute = require('./routes/taskRoute')
const userRoute = require('./routes/userRoute')
const resetRoute = require('./routes/resetRoute')
const app = express()

app.use(nodeSass({
    src: path.join(__dirname, "scss/"),
    dest: path.join(__dirname, "public/style")
}))

app.use(cookieParser())
app.use(express.json())
app.use(express.static(__dirname + "/public"))
app.use(bodyParser.urlencoded({ extended: false }))
app.use(taskRoute);
app.use(userRoute);
app.use(resetRoute);

app.set("view engine", "ejs")

mongoose.connect(process.env.DATABASE_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}, (err) => {
    if (err) return console.log(err);
    console.log("Connected to DB")

    app.listen(process.env.PORT || 8080, (err) => {
        console.log("app körs i 8000")
        if (err) console.log(err).return;
    })
})
