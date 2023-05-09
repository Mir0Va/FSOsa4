const blogsRouter = require("express").Router()
const Blog = require("../models/blog")
const User = require('../models/user')
const jwt = require("jsonwebtoken")
const { userExtractor } = require("../utils/middleware")

blogsRouter.get('/', async (request, response) => {
    const blogs = await Blog
      .find({}).populate("user", {username: 1, name: 1})
    response.json(blogs)
})

blogsRouter.post('/', userExtractor, async (request, response) => {
  const body = request.body
  const user = request.user

  const blog = new Blog({
    title:body.title, 
    author:body.author,
    url:body.url, 
    likes:body.likes, 
    user: user.id
  })

  const savedBlog = await blog.save()
  user.blogs = user.blogs.concat(savedBlog._id)
  await user.save()
  response.status(201).json(savedBlog)
})

blogsRouter.delete("/:id", userExtractor, async (request, response) => {
  const user = request.user

  const blog = await Blog.findById(request.params.id)

  if (!(blog.user.toString() === user.id.toString())){
    return response.status(401).send({error: "wrong user"})
  }

  await Blog.findByIdAndDelete(request.params.id)
  user.blogs = user.blogs.filter(id => id !== request.params.id)
  await user.save()
  response.status(204).end()
})

blogsRouter.put('/:id', userExtractor, async (request, response) => {
  const blog = request.body
  const savedBlog = await Blog.findByIdAndUpdate(request.params.id, blog, { new:true, runValidators:true, context:"query" })
  response.json(savedBlog)
})

module.exports = blogsRouter