const AuthController = require("./controllers/authentication")
const passport = require("passport")
const passportService = require("./services/passport")

const requireSignin = passport.authenticate("local", {session:false})

module.exports = app => {
    app.get('/', (req, res) => {
        res.send({test: 'test'})
    })
    
    app.post('/signup', AuthController.signup)
    app.post('/signin', requireSignin, AuthController.signin)
}