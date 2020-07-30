const bcrypt = require("bcrypt-nodejs")
const jwt = require("jwt-simple")

const dbConfig = require("../dbConfig")
const regexHub = require("../regexHub")
const User = require("../models/User")

exports.getUser = (req,res,next) => {
    const userReq = req.user
    userReq.password = undefined
    userReq.__v = undefined

    return res.send(userReq)
}

exports.editUser = (req, res, next) => {
    const userSettingsChanged  = (({fName, lName, email}) => ({fName, lName, email}))(req.body)
    User.findByIdAndUpdate({_id: req.user._id}, {...userSettingsChanged},{new: true})
      .then((result) => {
        return res.send(result)
      }).catch(err => {
        return next(err)
      })
}

exports.passwordChange = (req,res, next) => {
  const { body: { newPassword }, user } = req
  bcrypt.genSalt(10, (err, salt) => {
    if(err) {
      return next(err)
    }

    bcrypt.hash(newPassword, salt, null, (err, hash) => {
      if(err) {
        return next(err)
      }
      User.findByIdAndUpdate({_id: user._id}, {password: hash}, {new: true}).
        then((result) => {
          return res.send(result)
        }).catch(err => {
          return next(err)
        })
    })
  })
}