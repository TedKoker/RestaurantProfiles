const AuthController = require("./controllers/authentication")
const passport = require("passport")
const passportService = require("./services/passport")

const requireSignin = passport.authenticate("local", {session:false})

const loginValid = (req,res, next) => {
    const {email, password} = req.body
    if(!email || !password) {
        return res.status(400).send({message: "Missing credentials"})
    }
    return next()
}

module.exports = app => {
    app.get('/', (req, res) => {
        res.send({test: 'test'})
    })
    
    app.post('/signup', AuthController.signup)
    app.post('/signin', [loginValid,requireSignin], AuthController.signin)
}