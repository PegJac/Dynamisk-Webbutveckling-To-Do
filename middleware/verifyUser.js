const jtw = require('jsonwebtoken')
require('dotenv').config()

const verify = (req, res, next) => {
    const token = req.cookies.token;
    if (!token) return res.render('login.ejs', { error: "Logga in för att redigera listan" })

    try {
        const validUser = jtw.verify(token, process.env.SECRET_KEY)
        req.user = validUser;
        next()
    } catch (err) {
        console.log(err)
        res.send('invalid token')
    }
}

module.exports = verify;