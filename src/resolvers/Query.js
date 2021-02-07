import getUserId from '../utils/getUserId'

const Query = {
  async me(parent, args, { model: { User }, req }, info) {
    const userId = getUserId(req)
    if (!userId) {
      throw new Error('You are not authorized')
    }

    return await User.findById(userId)
  },
  async users(parent, args, { model: { User } }, info) {
    return User.find({})
  },
  async blogs(parent, { cursor }, { model: { Blog } }, info) {
    const limit = 2
    let hasNextPage = false
    let cursorQuery = {}
    if (cursor) {
      cursorQuery = { _id: { $lt: cursor } }
    }
    let blogs = await Blog.find(cursorQuery)
      .sort({ createdAt: -1 })
      .limit(limit + 1)
    if (blogs.length > limit) {
      hasNextPage = true
      blogs = blogs.slice(0, -1)
    }
    const newCursor = blogs[blogs.length - 1]._id

    return {
      blogs,
      cursor: newCursor,
      hasNextPage
    }
  },
  async singleBlogPost(parent, { id }, { model: { Blog } }, info) {
    const blog = await Blog.findById(id)
    if (!blog) {
      throw new Error('Post not found')
    }
    return blog
  },
  async blogBySlug(parent, { slug }, { model: { Blog } }, info) {
    const blog = await Blog.findOne({ slug })
    if (!blog) {
      throw new Error('Post not found')
    }
    return blog
  },
  async myBlogPosts(parent, args, { model: { Blog }, req }, info) {
    const userId = getUserId(req)

    const blogs = await Blog.find({ author: userId })
    return blogs
  }
}

export default Query
