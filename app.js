const express = require('express')
const app = express()
const cors = require('cors')
const blogRouter = require("./controllers/blogs")
const middleware = require("./utils/middleware")

app.use(cors())
app.use(express.json())

app.use("/api/blogs", blogRouter)

app.use(middleware.unknownEndpoint)
app.use(middleware.errorHandler)

module.exports = app