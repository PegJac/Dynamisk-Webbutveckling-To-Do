const express = require('express')
const bodyParser = require("body-parser")
const mongoose = require("mongoose")
const path = require('path')
require("dotenv").config();

const router = require('./routes/tasks')
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
app.use('/', router);

app.set("view engine", "ejs")

//connection string
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



/* <% if (data[i]._id == data) {%>
  <% console.log("tasken är" + data) %>
  <% } %>

 <form action="/edit" method="POST">
  <input type="text" name="name" id="editInput" value="<%= data.name %>" />
  <input type="text" name="id" value="<%= data.id %>" hidden />

  <button type="submit" id="editButton">Update</button>
</form> */