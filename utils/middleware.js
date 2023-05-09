const logger = require("./logger")
const jwt = require("jsonwebtoken")
const User = require("../models/user")

const unknownEndpoint= (request,response) => {
  response.status(404).send({ error: "unknown endpoint" })
}
    
const errorHandler = (error, request, response, next) =>{
  logger.error(error.message)
  if(error.name==="CastError"){
    return response.status(400).send({error:"malformatted id"})
  }else if (error.name==="ValidationError"){
    return response.status(400).send({error:error.message})
  }else if (error.name==="JsonWebTokenError"){
    return response.status(401).json({error: error.message})
  }
  next(error)
}

const tokenExtractor = (request,response, next) => {
  const authorization = request.get("Authorization")
  if (authorization && authorization.startsWith("Bearer")){
    request.token = authorization.replace("Bearer ", "")
  }
  next()
}

const userExtractor = async (request,response, next) => {
  const decodedToken = await jwt.verify(request.token, process.env.SECRET)
  if (!decodedToken){
    return response.status(401).json({error: "invalid token"})
  }
  request.user = await User.findById(decodedToken.id)
  next()
}

module.exports = {
    unknownEndpoint,
    errorHandler,
    tokenExtractor,
    userExtractor
}