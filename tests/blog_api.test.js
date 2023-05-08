const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const api = supertest(app)
const Blog = require("../models/blog")
const blog = require('../models/blog')

const initialBlogs = [
  {title :"First blog", author: "Person A", url : "doesnt_exit", likes: 5},
  {title :"Second blog", author: "Person B", url : "doesnt_exit", likes: 4}
]

beforeEach(async() => {
  await Blog.deleteMany({})
  initialBlogs.forEach(blog =>{
    new Blog(blog).save()
  })
})
describe("getter method", () => {
  test('blogs are returned as json', async () => {
    await api
      .get('/api/blogs')
      .expect(200)
      .expect('Content-Type', /application\/json/)
  })

  test('all blogs are returned', async () => {  
    const response = await api.get('/api/blogs')
    expect(response.body).toHaveLength(initialBlogs.length)
  })

  test('blogs contain a certain blog', async () => {  
    const response = await api.get('/api/blogs')
    const authors = response.body.map(blog => blog.author)
    expect(authors).toContain("Person A")
  })

  test("blogs contain id", async() => {
    const response = await api.get("/api/blogs")
    expect(response.body[0].id).toBeDefined()
  })
})

describe("post method", () => {
  test("blog post works", async() => {
    const testBlog = {title :"post blog", author: "Person C", url : "None", likes: 6}
    await api.post("/api/blogs")
      .send(testBlog)
      .expect(201)
      .expect('Content-Type', /application\/json/)
    const blogsInDB = await api.get("/api/blogs")
    expect(blogsInDB.body).toHaveLength(initialBlogs.length + 1)
  })

  test("blog likes set to 0 if likes not defined", async() => {
    const testBlog = {title :"post blog", author: "Person C", url : "None"}
    await api.post("/api/blogs")
      .send(testBlog)
      .expect(201)
      .expect('Content-Type', /application\/json/)
    const blogsInDB = await api.get("/api/blogs")
    expect(blogsInDB.body[2].likes).toBe(0)
  })

  test("if blog author not defined status 400", async() => {
    const testBlog = {title :"post blog", url : "None", likes: 1}
    await api.post("/api/blogs")
      .send(testBlog)
      .expect(400)
  })

  test("if blog url not defined status 400", async() => {
    const testBlog = {title :"post blog", author: "Person C", likes: 1}
    await api.post("/api/blogs")
      .send(testBlog)
      .expect(400)
  })
})

describe("delete method", () => {
  test("deletion works with correct id", async() => {
    const response = await api.get('/api/blogs')
    const id = response.body[0].id
    await api.delete(`/api/blogs/${id}`)
    expect(204)

    const blogsAtEnd = await api.get('/api/blogs')
    expect(blogsAtEnd.body).toHaveLength(initialBlogs.length - 1)
    expect(blogsAtEnd.body).not.toContain(initialBlogs[0])
  })

  test("fail with wrong id", async() => {
    await api.delete(`/api/blogs/1`)
    expect(400)
  })
})

describe("put method", () => {
  test("put works with correct id", async() => {
    const response = await api.get('/api/blogs')
    const id = response.body[0].id
    await api.put(`/api/blogs/${id}`)
      .send({title :"post blog", author: "Person C", url : "None", likes: 6})
      .expect(200)
      .expect('Content-Type', /application\/json/)

    const blogsAtEnd = await api.get('/api/blogs')
    expect(blogsAtEnd.body[0].author).toBe("Person C")
  })

  test("fail with wrong id", async() => {
    await api.put(`/api/blogs/1`)
    expect(400)
  })
})

afterAll(async () => {
  await mongoose.connection.close()
})