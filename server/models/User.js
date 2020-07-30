const bcrypt = require("bcrypt-nodejs")
const e = require("express")
const mongoose = require("mongoose")

const regexHub = require("../regexHub")

const Schema = mongoose.Schema

/**Remember.. when a user wants to change detalis of existing restuarant
 * The server must check that this user really owns that restuarant!
 */

const userSchema = new Schema({
    email: { 
        type: String,
        unique: true,
        lowercase: true,
        required: true,
        validate: regexHub.emailRegex
    },
    password: {
        type: String, 
        required: true,
        validate: regexHub.passwordRegex
    },
    fName: {type: String, required: true},
    lName: {type: String, required: true},
    restaurantIds: [{type: String}]
})

userSchema.pre("save", function(next) {
    const user = this
    bcrypt.genSalt(10, function(err, salt) {
        if(err) {
            return next(err)
        }

        bcrypt.hash(user.password, salt, null,  function(err, hash) {
            if(err) {
                next(err)
            }
            user.password = hash
            next()
        })
    })
})

// userSchema.pre("update", (next) => {
//     console.log('pre update')
//     next()
// })

// userSchema.pre("updateOne", () => {
//     console.log('pre update one')
// })

// userSchema.pre("findOneAndUpdate", (next) => {
//     const user = this
//     console.log("find one an update pre action", user)
//     next()
// })

// userSchema.post("findOneAndUpdate", (e) => {
//     console.log('inside post', e)
// })

userSchema.methods.comparePasswords = (candidatePassword,user, callback) => {
    bcrypt.compare(candidatePassword, user.password, (err, isMatch) => {
        if(err) {
            callback(err)
        } else {
            callback(null, isMatch)
        }
    })
}

userSchema.methods.changePassword = (user) => {
    user.lName = "ted"
    user.fName = "ted"
    // bcrypt.genSalt(10, function(err, salt) {
    //     if(err) {
    //         return next(err)
    //     }

    //     bcrypt.hash(newPassword, salt, null,  function(err, hash) {
    //         if(err) {
    //             next(err)
    //         }
    //         user.password = hash
    //         next()
    //     })
    // })
}

const ModealClass = mongoose.model('user', userSchema)
module.exports = ModealClass