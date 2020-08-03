const Restuarant = require("../models/Restuarant")

exports.post = (req,res,next) => {
    const {location, menu} = req.body
    const owner = req.user._id
    const restuarant = new Restuarant({
        location, menu, owner
    })
    restuarant.save(err => {
        if(err) {
            return next(err)
        }
        res.json(restuarant)
    })
}

exports.put = (req, res, next) => {
    
}