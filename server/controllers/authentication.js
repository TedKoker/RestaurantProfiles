const jwt = require("jwt-simple")

const dbConfig = require("../dbConfig")
const regexHub = require("../regexHub")
const User = require("../models/User")

function tokenForUser(user) {
    const timestamp = new Date().getDate()
    return jwt.encode({sub: user.id, iat: timestamp}, dbConfig.secret)
}

exports.signin = (req, res, next) => {
    const {email, password} = req.body
    if(!email || !password) {
        res.status(400).send({error: "you must fill email and password"})
    }
    res.send({token: tokenForUser(req.user)})
}

exports.signup = (req,res,next) => {
    const {email, password, fName, lName} = req.body

    if(!email || !password || !fName || !lName) {
        return res.status(422).send({error: "All parameters must be sent"})
    }
    if(!email.match(regexHub.emailRegex)) {
        return res.status(400).send({error: "email is not valid"})
    }
    if(!password.match(regexHub.passwordRegex)) {
        return res.status(400).send({error: "password must contain atleast 8 characters, atleast one lowercase, atleast one uppercase, atleast one number, atleast one special character and no whitspaces"})
    }

    User.findOne({email: email}, (err, existingUser) => {
        if(err) {
            return next(err)
        }

        if(existingUser) {
            return res.status(422).send({error:"Email is in use"})
        }

        const user = new User({
            email: email,
            password: password,
            fName: fName,
            lName: lName
        })

        user.save(err => {
            if(err) {
                return next(err)
            }

            res.json({token: tokenForUser(user)})
        })
    })
}