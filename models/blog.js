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
    author: String,
    url: String,
    likes: Number
})
  
module.exports = mongoose.model("Blog", blogSchema)