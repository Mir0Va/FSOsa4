const mongoose = require("mongoose")
const uniqueValidator = require("mongoose-unique-validator")
const Blog = require("./blog")

const userSchema = new mongoose.Schema({
    "username": {
        type:String,
        minLength: 3,
        required: true,
        unique: true
    },
    "personName": String,
    "passwordHash": {
        type:String,
        required: true
    },
    "blogs": [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Blog'
        }
    ]
})

userSchema.plugin(uniqueValidator)

userSchema.set("toJSON", {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id
        delete returnedObject.__v
        delete returnedObject._id
        delete returnedObject.passwordHash
    }
})

module.exports = mongoose.model("User", userSchema)