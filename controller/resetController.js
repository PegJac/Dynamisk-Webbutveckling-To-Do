const User = require('../models/user')
const crypto = require("crypto");
const nodemailer = require("nodemailer");
const bcrypt = require("bcrypt");

const transport = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: "feddynamiskweb@gmail.com",
        pass: "FedDynamiskWeb.2021"
    },
    tls: {
        rejectUnauthorized: false
    }
})

const resetGet = (req, res) => {
    res.render('reset.ejs', { error: "empty" })
}

const resetPost = async (req, res) => {
    try {
        const email = req.body.email
        const user = await User.findOne({ email: email });
        if (req.body.email == "") return res.render("reset.ejs", { error: "Skriv in din email-adress" })
        if (!user) return res.render("register.ejs", { error: "Email adressen finns inte, registrera ett konto" })

        const token = await crypto.randomBytes(32).toString("hex");
        user.token = token;
        user.tokenExpiration = Date.now() + 3600000;
        await user.save()

        await transport.sendMail({
            from: "feddynamiskweb@gmail.com",
            to: user.email,
            subject: "Reset password request",
            html: `<h2> Följ <a href="http://localhost:8000/reset/${user.token}"> Länken </a> för att återställa lösenordet </h2>`
        })
        res.render("resetPassword.ejs", {
            email: user.email,
            error: "empty"
        })
    } catch (error) {
        console.log(error)
        return res.render("reset.ejs", { error: error })
    }
}

const resetToken = async (req, res) => {

    const token = req.params.token;
    try {
        const user = await User.findOne({ token: token, tokenExpiration: { $gt: Date.now() } });
        if (!user) return res.redirect("/register", { error: "Konto finns inte registrerat" });

        res.render("resetPassword.ejs", {
            error: "empty",
            email: user.email
        })
    }
    catch (error) {
        res.render("reset.ejs", { error: "Återställningen av lösenordet misslyckades, försök igen" })
    }
}

const resetPasswordPost = async (req, res) => {

    const { password, email } = req.body;

    const salt = await bcrypt.genSalt(12);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await User.findOne({ email: email });
    user.password = hashedPassword;
    await user.save();

    res.redirect("/login", { error: "Återställning lyckad - logga in!" })
}

module.exports = {
    resetGet,
    resetPost,
    resetToken,
    resetPasswordPost
}