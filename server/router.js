const AuthController = require("./controllers/authentication")
const passport = require("passport")
const passportService = require("./services/passport")
const regexHub = require('./regexHub')
const restuarantConroller = require("./controllers/restuarantController")
const User = require('./models/User')
const userController = require("./controllers/userController")

const requireSignin = passport.authenticate("local", {session:false})
const requireAuth = passport.authenticate("jwt", { session: false })

const loginValid = (req,res, next) => {
    const {email, password} = req.body
    if(!email || !password) {
        return res.status(400).send({message: "Missing credentials"})
    }
    return next()
}

const userEditValud = (req,res,next) => {
    const {fName, lName, email} = req.body
    if(!email || !lName || !fName) {
        return res.status(400).send({message: "Request must contain all of the fields!"})
    }

    if(!email.match(regexHub.emailRegex)) {
        return res.status(400).send({message: "Email is not valid"})
    }

    User.findOne({email: email}).then(result => {
        if(result && result.email !== req.user.email ) {
            return res.status(422).send({message: "Email already in use"})
        }

        return next()
    }).catch(err => {
        return next(err)
    })
}

const passwordChangeValidation = (req,res,next) => {
    const {newPassword} = req.body
    if(!newPassword) {
        return res.status(400).send({message: "Request did not contain new password"})
    }
    if(!newPassword.match(regexHub.passwordRegex)) {
        return res.status(400).send({message: "password must contain atleast 8 characters, atleast one lowercase, atleast one uppercase, atleast one number, atleast one special character and no whitspaces"})
    }

    return next()
}

const restuarantPostValid = (req,res,next) => {
    const {location} = req.body
    if(!location) {
        return res.status(400).send({message: "Did not recived any location"})
    }

    if(!location.city || !location.adress) {
        return res.status(400).send({message: "Adress and city are required"})
    }

    return next()
}

module.exports = app => {
    app.get('/userByToken',requireAuth, userController.getUser)
    app.post('/signup', AuthController.signup)
    app.post('/signin', [loginValid,requireSignin], AuthController.signin)
    app.put('/userSettings', [requireAuth, userEditValud], userController.editUser)
    app.put('/passwordChange', [requireAuth, passwordChangeValidation], userController.passwordChange)

    app.post('/restuarant',[requireAuth, restuarantPostValid], restuarantConroller.post)
}