const listHelper = require('../utils/list_helper')

test('dummy returns one', () => {
  const blogs = []

  const result = listHelper.dummy(blogs)
  expect(result).toBe(1)
})

describe('total likes', () => {
  const listWithOneBlog = [
    {
      _id: '5a422aa71b54a676234d17f8',
      title: 'Go To Statement Considered Harmful',
      author: 'Edsger W. Dijkstra',
      url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
      likes: 5,
      __v: 0
    }
  ]

   biggerList = listWithOneBlog.concat(listWithOneBlog.map(item => item))
  for (let i=0;i<1;i++){
    biggerList=biggerList.concat(biggerList.map(item => item))
  }

  test("of empty list is zero", () =>{
    const result = listHelper.totalLikes([])
    expect(result).toBe(0)
  })

  test('when list has only one blog, equals the likes of that', () => {
    const result = listHelper.totalLikes(listWithOneBlog)
    expect(result).toBe(5)
  })

  test("of a bigger list is calculated", () => {
    const result = listHelper.totalLikes(biggerList)
    expect(result).toBe(20)
  })
})

describe('favorite blog', () => {
  const listWithOneBlog = [
    {
      _id: '5a422aa71b54a676234d17f8',
      title: 'Go To Statement Considered Harmful',
      author: 'Edsger W. Dijkstra',
      url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
      likes: 5,
    }
  ]

   const biggerList = listWithOneBlog.concat(
    {_id: '5a422aa71b54a676234d17f9', title: 'a real title', author: 'Person A', url: 'no.on', likes: 4,},
    {_id: '5a422aa71b54a676234d17f7', title: 'Funny world', author: 'Person B', url: 'doesn.t/exist', likes: 8,},
   )

   const sameLikes = listWithOneBlog.concat({_id: '5a422aa71b54a676234d17f9', title: 'a real title', author: 'Person A', url: 'no.on', likes: 5})

  test("of empty list is zero", () =>{
    const result = listHelper.favoriteBlog([])
    expect(result).toEqual({})
  })

  test("with one blog", () =>{
    const result = listHelper.favoriteBlog(listWithOneBlog)
    expect(result).toEqual({title: 'Go To Statement Considered Harmful', author: 'Edsger W. Dijkstra',likes: 5})
  })

  test("with many blogs containing different amounts of likes", () =>{
    const result = listHelper.favoriteBlog(biggerList)
    expect(result).toEqual({title: 'Funny world', author: 'Person B', likes: 8})
  })

  test("with many blogs containing same amounts of likes", () =>{
    const result = listHelper.favoriteBlog(sameLikes)
    expect(result).toEqual({title: 'Go To Statement Considered Harmful', author: 'Edsger W. Dijkstra',likes: 5})
  })
})

describe('most blogs', () => {
  const listWithOneBlog = [
    {
      _id: '5a422aa71b54a676234d17f8',
      title: 'Go To Statement Considered Harmful',
      author: 'Edsger W. Dijkstra',
      url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
      likes: 5,
    }
  ]

  const biggerList = listWithOneBlog.concat(
    {_id: '5a422aa71b54a676234d17f9', title: 'a real title', author: 'Person A', url: 'no.on', likes: 4,},
    {_id: '5a422aa71b54a676234d17f7', title: 'Funny world', author: 'Person B', url: 'doesn.t/exist', likes: 8,},
    {_id: '5a422aa71b54a676234d17f7', title: 'Funny world', author: 'Person c', url: 'doesn.t/exist', likes: 8,},
    {_id: '5a422aa71b54a676234d17f7', title: 'Funny world', author: 'Person D', url: 'doesn.t/exist', likes: 8,},
    {_id: '5a422aa71b54a676234d17f7', title: 'Funny world', author: 'Person A', url: 'doesn.t/exist', likes: 8,},
  )
  
  const listWithTwoAuthors = biggerList.concat({_id: '5a422aa71b54a676234d17f9', title: 'a real title', author: 'Person B', url: 'no.on', likes: 4,},)
  
  test("of empty list is zero", () =>{
    const result = listHelper.mostBlogs([])
    expect(result).toEqual({})
  })

  test("with one blog", () =>{
    const result = listHelper.mostBlogs(listWithOneBlog)
    expect(result).toEqual({author: 'Edsger W. Dijkstra',blogs: 1})
  })

  test("with many blogs", () =>{
    const result = listHelper.mostBlogs(biggerList)
    expect(result).toEqual({author: 'Person A', blogs: 2})
  })

  test("with two authors with same amount of blogs", () =>{
    const result = listHelper.mostBlogs(listWithTwoAuthors)
    expect(result).toEqual({author: 'Person A', blogs: 2})
  })
})

describe('most likes', () => {
  const listWithOneBlog = [
    {
      _id: '5a422aa71b54a676234d17f8',
      title: 'Go To Statement Considered Harmful',
      author: 'Edsger W. Dijkstra',
      url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
      likes: 5,
    }
  ]

  const biggerList = listWithOneBlog.concat(
    {_id: '5a422aa71b54a676234d17f9', title: 'a real title', author: 'Person A', url: 'no.on', likes: 2,},
    {_id: '5a422aa71b54a676234d17f7', title: 'Funny world', author: 'Person B', url: 'doesn.t/exist', likes: 8,},
    {_id: '5a422aa71b54a676234d17f7', title: 'Funny world', author: 'Person c', url: 'doesn.t/exist', likes: 7,},
    {_id: '5a422aa71b54a676234d17f7', title: 'Funny world', author: 'Person D', url: 'doesn.t/exist', likes: 6,},
    {_id: '5a422aa71b54a676234d17f7', title: 'Funny world', author: 'Person A', url: 'doesn.t/exist', likes: 8,},
  )
  
  const listWithTwoAuthors = biggerList.concat({_id: '5a422aa71b54a676234d17f9', title: 'a real title', author: 'Person B', url: 'no.on', likes: 2,},)
  
  test("of empty list is zero", () =>{
    const result = listHelper.mostLikes([])
    expect(result).toEqual({})
  })

  test("with one blog", () =>{
    const result = listHelper.mostLikes(listWithOneBlog)
    expect(result).toEqual({author: 'Edsger W. Dijkstra',likes: 5})
  })

  test("with many blogs", () =>{
    const result = listHelper.mostLikes(biggerList)
    expect(result).toEqual({author: 'Person A', likes: 10})
  })

  test("with two authors with same amount of likes", () =>{
    const result = listHelper.mostLikes(listWithTwoAuthors)
    expect(result).toEqual({author: 'Person A', likes: 10})
  })
})