const e = require("express")
const mongoose = require("mongoose")
const User = require("./User")

const Schema = mongoose.Schema

/**Remember.. when a user wants to change detalis of existing restuarant
 * The server must check that this user really owns that restuarant!
 */

 const standartString = {
    type: String,
    required: true,
    lowercase: true
 }

 const restuarantSchema = new Schema({
     owner: {
         ...standartString
     },
     location: {
         city: {
            ...standartString
         },
         adress: {
            ...standartString
         }
     },
     menu: [{
         category: {
            type: String,
            lowercase: true
         },
         items: [{
             name: {
                 type: String,
                 lowercase: true
             },
             price: Number
         }]
     }]
 })

 restuarantSchema.post("save", (restuarant) => {
    User.findByIdAndUpdate(restuarant.owner,{"$push": {restaurantIds: restuarant._id}}, (err) => {
        if(err) {
            throw err
        }
    })
 })

 const ModealClass = mongoose.model('restuarant', restuarantSchema)
 module.exports = ModealClass