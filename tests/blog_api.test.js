const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const api = supertest(app)
const Blog = require("../models/blog")
const jwt = require("jsonwebtoken")
const bcrypt = require('bcrypt')
const User = require('../models/user')

const initialBlogs = [
  {title :"First blog", author: "Person A", url : "doesnt_exit", likes: 5},
  {title :"Second blog", author: "Person B", url : "doesnt_exit", likes: 4}
]
const initialUser = {username:"root1", passwordHash:"JustTesting"}
let token = jwt.sign("a", process.env.SECRET)

beforeEach(async() => {
  await User.deleteMany({})
  await new User(initialUser).save()
  const user = await User.findOne({username:"root1"})
  token = await jwt.sign({username:user.username, id: user._id}, process.env.SECRET)

  await Blog.deleteMany({})
  initialBlogs.forEach(async(blog) =>{
    blog.user = user._id
    let blogObject = new Blog(blog)
    await blogObject.save()
  })
})

describe("getter method", () => {
  test('blogs are returned as json', async () => {
    await api
      .get('/api/blogs')
      .expect(200)
      .expect('Content-Type', /application\/json/)
  },10000)

  test('all blogs are returned', async () => {  
    const response = await api.get('/api/blogs')
    .expect(200)
    expect(response.body).toHaveLength(initialBlogs.length)
  },10000)

  test('blogs contain a certain blog', async () => {  
    const response = await api.get('/api/blogs')
    .expect(200)
    const authors = response.body.map(blog => blog.author)
    expect(authors).toContain("Person A")
  },10000)

  test("blogs contain id", async() => {
    const response = await api.get("/api/blogs")
    .expect(200)
    expect(response.body[0].id).toBeDefined()
  },10000)
})

describe("post method", () => {
  test("blog post works", async() => {
    const testBlog = {title :"post blog", author: "Person C", url : "None", likes: 6}
    await api.post("/api/blogs")
      .set("Authorization", `Bearer ${token}`)
      .send(testBlog)
      .expect(201)
      .expect('Content-Type', /application\/json/)
    const blogsInDB = await api.get("/api/blogs")
    expect(blogsInDB.body).toHaveLength(initialBlogs.length + 1)
  })

  test("blog likes set to 0 if likes not defined", async() => {
    const testBlog = {title :"post blog", author: "Person C", url : "None"}
    await api.post("/api/blogs")
      .set("Authorization", `Bearer ${token}`)
      .send(testBlog)
      .expect(201)
      .expect('Content-Type', /application\/json/)
    const blogsInDB = await api.get("/api/blogs")
    expect(blogsInDB.body[2].likes).toBe(0)
  })

  test("if blog author not defined status 400", async() => {
    const testBlog = {title :"post blog", url : "None", likes: 1}
    await api.post("/api/blogs")
      .set("Authorization", `Bearer ${token}`)
      .send(testBlog)
      .expect(400)
  })

  test("if blog url not defined status 400", async() => {
    const testBlog = {title :"post blog", author: "Person C", likes: 1}
    await api.post("/api/blogs")
      .set("Authorization", `Bearer ${token}`)
      .send(testBlog)
      .expect(400)
  })

  test("if no authorization key is given, errno 401", async() => {
    const testBlog = {title :"post blog", author: "Person C", likes: 1, url: "none"}
    await api.post("/api/blogs")
      .send(testBlog)
      .expect(401)
  })
})

describe("delete method", () => {
  test("deletion works with correct id", async() => {
    const response = await api.get('/api/blogs')
    const id = response.body[0].id
    await api.delete(`/api/blogs/${id}`)
    .set("Authorization", `Bearer ${token}`)
    expect(204)

    const blogsAtEnd = await api.get('/api/blogs')
    expect(blogsAtEnd.body).toHaveLength(initialBlogs.length - 1)
    expect(blogsAtEnd.body).not.toContain(initialBlogs[0])
  })

  test("fail with wrong id", async() => {
    await api.delete(`/api/blogs/1`)
    .set("Authorization", `Bearer ${token}`)
    expect(400)
  })
})

describe("put method", () => {
  test("put works with correct id", async() => {
    const response = await api.get('/api/blogs')
    const id = response.body[0].id
    await api.put(`/api/blogs/${id}`)
    .set("Authorization", `Bearer ${token}`)
      .send({title :"post blog", author: "Person C", url : "None", likes: 6})
      .expect(200)
      .expect('Content-Type', /application\/json/)

    const blogsAtEnd = await api.get('/api/blogs')
    expect(blogsAtEnd.body[0].author).toBe("Person C")
  })

  test("fail with wrong id", async() => {
    await api.put(`/api/blogs/1`)
    .set("Authorization", `Bearer ${token}`)
    expect(400)
  })
})

describe('when there is initially one user in db', () => {
  beforeEach(async () => {
    await User.deleteMany({})

    const passwordHash = await bcrypt.hash('sekret', 10)
    const user = new User({ username: 'root', passwordHash:passwordHash })

    await user.save()
  })

  test('creation succeeds with a fresh username', async () => {
    const usersAtStart = await User.find({})
    const usersAtStartJson=usersAtStart.map(user => user.toJSON())

    const newUser = {
      username: 'Mir0Va',
      name: 'Miro',
      password: 'salainen',
    }

    await api
      .post('/api/users')
      .send(newUser)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const usersAtEnd = await User.find({})
    const usersAtEndJson=usersAtEnd.map(user => user.toJSON())
    expect(usersAtEndJson).toHaveLength(usersAtStartJson.length + 1)

    const usernames = usersAtEndJson.map(u => u.username)
    expect(usernames).toContain(newUser.username)
  })

  test('creation fails with too short password', async () => {
    const newUser = {
      username: 'Mir0Va',
      name: 'Miro',
      password: 'sa',
    }

    await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)
  })

  test('creation fails with too short username', async () => {
    const newUser = {
      username: 'm',
      name: 'Miro',
      password: 'salas',
    }

    await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)
  })

  test('creation fails with non-unique username', async () => {
    const newUser = {
      username: 'root',
      name: 'SuperRoot',
      password: 'salas',
    }

    await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)
  })
})

afterAll(async () => {
  await mongoose.connection.close()
})