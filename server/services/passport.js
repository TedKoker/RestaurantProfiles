const ExtractJwt = require("passport-jwt").ExtractJwt
const JwtStrategy = require("passport-jwt").Strategy
const LocalStrategy = require("passport-local")
const passport = require("passport")
const e =require("express")

const dbConfig = require("../dbConfig")
const User = require("../models/User")

const localOptions = {
    usernameField: 'email'
}

const localLogin = new LocalStrategy(localOptions, (email, password, done) => {
    User.findOne({email: email}, (err, user ) => {
        if(err) {
            return done(err)
        }
        
        if(!user) {
            return done(null, {faild: true, message: "Credentials are not valid"})
        }
        
        user.comparePasswords(password, user, (err, isMatch) => {
            if(err) {
                return done(err)
            }

            if(!isMatch) {
                return done(null, {faild: true, message: "Credentials are not valid"})
            }
            return done(null,user)
        })
    })
})

const jwtOptions = {
    jwtFromRequest: ExtractJwt.fromHeader("authorization"),
    secretOrKey: dbConfig.secret
}

//create JWT strategy
const jwtLogin = new JwtStrategy(jwtOptions, function(payload, done) {
    // see if the user Id in the payload exists in out database
    //if it does, call done with that user
    //otherwise, call done without a user object
    User.findById(payload.sub, (err, user) => {
        if(err) {
            return done(err,false)
        }
        if(user) {
            done(null, user)
        } else {
            done(null, false)
        }
    })
})

passport.use(jwtLogin)
passport.use(localLogin)