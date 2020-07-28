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