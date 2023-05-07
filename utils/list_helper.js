const _ = require("lodash")

const dummy = (blogs) => {
  return 1
}
  
const totalLikes = (blogs) => {
    const likesReducer = (sum,item) => {
        return sum + item.likes
    }

    return blogs.length===0
    ? 0
    : blogs.reduce(likesReducer,0)
}

const favoriteBlog = (blogs) => {
    const maxLikes = Math.max(...blogs.map(blog => blog.likes))
    const favorite = blogs.find(blog => blog.likes==maxLikes)
    return blogs.length===0
    ? {}
    : {title: favorite.title, author: favorite.author, likes: favorite.likes}
}

const mostBlogs = (blogs) => {
    const authorBlogs = 
      _(blogs).groupBy("author")
        .map((objs,authorName) => ({"author":authorName, "blogs":objs.length}))
        .value()
    return blogs.length===0
    ? {}
    : _.maxBy(authorBlogs,"blogs") 
}

const mostLikes = (blogs) => {
    const authorBlogs = 
      _(blogs).groupBy("author")
        .map((objs,authorName) => ({"author":authorName, "likes":_.sumBy(objs,"likes")}))
        .value()
    return blogs.length===0
    ? {}
    : _.maxBy(authorBlogs,"likes") 
}

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs,
  mostLikes
}