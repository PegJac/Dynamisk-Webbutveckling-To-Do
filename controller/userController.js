const express = require('express')
const mongoose = require('mongoose')
const jwt = require('jsonwebtoken')
const User = require('../models/user')
require("dotenv").config();
const bcrypt = require('bcrypt')
const router = express.Router()
const error = []

require("dotenv").config()

const loginGet = async (req, res) => {
    res.render('login.ejs', {
        error: "empty"
    })
}

const loginPost = async (req, res) => {
    try {
        const { email, password } = req.body
        const user = await User.findOne({ email: email })
        if (!user) {
            res.render('login.ejs', {
                error: "Epost är felaktig"
            })
        }

        const validUser = await bcrypt.compare(password, user.password)
        if (!validUser) {
            return res.render('login.ejs', {
                error: "Fel lösenord"
            })
        }

        const token = await jwt.sign({ user: user }, process.env.SECRET_KEY)

        if (token) {
            const cookie = req.cookies.token

            if (!cookie) {
                res.cookie('token', token, { maxAge: 600000, httpOnly: true })
            }

            return res.redirect("/main")
        }

    } catch (error) {
        console.log(error)
        return res.render('login.ejs', {
            error: "Inloggningen misslyckades"
        })
    }
}

const registerGet = (req, res) => {
    res.render('register.ejs', { error: "empty" })
}

const registerPost = async (req, res) => {

    try {
        if (!req.body.email || !req.body.username || !req.body.password) {
            res.render('register.ejs', { error: "Fyll i alla fält" })
        }

        const existingEmail = await User.findOne({ email: req.body.email })
        if (existingEmail) {
            res.render('register.ejs', { error: "Email adressen finns redan" })
        }

        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(req.body.password, salt)

        const newUser = await new User({
            email: req.body.email,
            username: req.body.username,
            password: hashedPassword
        }).save()

        res.render('login.ejs', {
            error: "Registrering lyckades - logga in!"
        })
    } catch (error) {
        console.log(error)

        return res.render('register.ejs', { error })
    }
}

const logoutPost = (req, res) => {
    res.clearCookie("token").redirect("/")
}

module.exports = {
    registerGet,
    registerPost,
    loginPost,
    loginGet,
    logoutPost
}