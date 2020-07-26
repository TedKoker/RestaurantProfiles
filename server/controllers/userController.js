const { emailRegex } = require("../regexHub")

exports.getUser = (req,res,next) => {
    const userReq = req.user
    userReq.password = undefined
    userReq.__v = undefined

    return res.send(userReq)
}