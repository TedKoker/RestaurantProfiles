const AuthController = require("./controllers/authentication")
const passport = require("passport")
const passportService = require("./services/passport")
const regexHub = require('./regexHub')
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
    
    //return next()
}

module.exports = app => {
    app.get('/userByToken',requireAuth, userController.getUser)
    app.post('/signup', AuthController.signup)
    app.post('/signin', [loginValid,requireSignin], AuthController.signin)
    app.put('/userSettings', [requireAuth, userEditValud], userController.editUser)
}