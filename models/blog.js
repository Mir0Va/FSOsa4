const mongoose = require("mongoose")
const config = require("../utils/config")
const logger = require("../utils/logger")

mongoose.set("strictQuery",false)
const mongoUrl = config.MONGODB_URI

logger.info(`connecting to ${mongoUrl}`)

mongoose.connect(mongoUrl)
    .then(() => logger.info("connected to MongoDB"))
    .catch(error => logger.error('error connecting to MongoDB:', error.message))

const blogSchema = new mongoose.Schema({
    title: String,
    author: {
        type:String,
        required: true
    },
    url: {
        type:String,
        required: true
    },
    likes: Number
})

blogSchema.set("toJSON", {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id
        if (!returnedObject.likes){
            returnedObject.likes = 0
        }
        delete returnedObject._id
    }
})

module.exports = mongoose.model("Blog", blogSchema)