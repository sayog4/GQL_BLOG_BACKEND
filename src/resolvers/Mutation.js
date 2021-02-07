import slugify from 'slugify'
import { stripHtml } from 'string-strip-html'

import jwtToken from '../utils/jwtToken'
import getUserId from '../utils/getUserId'

const Mutation = {
  async signUp(parent, { data }, { model: { User } }, info) {
    const { name, email, password } = data

    const userExists = await User.findOne({ email })
    if (userExists) {
      throw new Error('User Already Exists')
    }
    const user = await User.create({
      name,
      email,
      password
    })
    return {
      user,
      token: jwtToken(user._id)
    }
  },
  async logIn(parent, { data }, { model: { User } }, info) {
    const { email, password } = data

    const user = await User.findOne({ email })
    if (user && (await user.matchPassword(password))) {
      return {
        user,
        token: jwtToken(user._id)
      }
    } else {
      throw new Error('Invalid Email or Password')
    }
  },
  async updateUser(parent, { data }, { req, model: { User } }, info) {
    const userId = getUserId(req)

    if (!userId) {
      throw new Error('You are not Authorized')
    }
    const user = await User.findById(userId)

    user.name = data.name || user.name
    if (data.password && data.password.length > 0) {
      user.password = data.password
    }
    const updatedUser = await user.save()
    return updatedUser
  },
  async deleteUser(
    parent,
    args,
    { req, model: { User, Blog, Comment } },
    info
  ) {
    const userId = getUserId(req)
    if (!userId) {
      throw new Error('You are not Authorized')
    }
    const user = await User.findById(userId)
    await Blog.deleteMany({ author: userId })

    await Comment.deleteMany({ post: id })

    await user.remove()
    return true
  },
  async createBlogPost(parent, { data }, { req, model: { Blog } }, info) {
    const userId = getUserId(req)
    if (!userId) {
      throw new Error('You are not Authorized')
    }
    const { title, body, image } = data

    const { result } = stripHtml(body.substring(0, 160))
    const blog = new Blog()
    blog.title = title
    blog.image = image
    blog.body = body
    blog.excerpt = body.substring(0, 250)
    let SLUG = slugify(title).toLowerCase()
    blog.slug = SLUG

    blog.mtitle = `${title} | ${process.env.APP_NAME}`
    blog.mdesc = result
    blog.author = userId

    return blog.save()
  },
  async updateBlogPost(parent, { id, data }, { req, model: { Blog } }, info) {
    const userId = getUserId(req)

    if (!userId) {
      throw new Error('You are not Authorized')
    }

    const blog = await Blog.findById(id)
    if (!blog) {
      throw new Error('Post not found')
    }
    if (String(blog.author) !== userId) {
      throw new Error('You are not Authorized to update this Post')
    }

    blog.title = data.title || blog.title
    blog.slug = slugify(data.title || blog.title).toLowerCase()
    blog.mtitle = `${data.title || blog.title} | ${process.env.APP_NAME}`
    blog.image = data.image || blog.image

    if (data.body) {
      const { result } = stripHtml(data.body.substring(0, 160))
      blog.body = data.body
      blog.excerpt = data.body.substring(0, 250)

      blog.mdesc = result
    }

    blog.author = userId

    return blog.save()
  },
  async deleteBlogPost(
    parent,
    { id },
    { req, model: { Blog, Comment } },
    info
  ) {
    const userId = getUserId(req)
    if (!userId) {
      throw new Error('You are not Authorized')
    }
    const blog = Blog.findById(id)
    if (!blog) {
      throw new Error('Blog not Found')
    }
    await Comment.deleteMany({ post: id })

    await blog.remove()

    return true
  },
  async createComment(
    parent,
    { data: { text, post } },
    { req, model: { Comment, Blog } },
    info
  ) {
    const userId = getUserId(req)

    if (!userId) {
      throw new Error('You are not Authorized')
    }
    const blog = await Blog.findById(post)
    if (!blog) {
      throw new Error('No blog post found')
    }
    const comments = await Comment.find({ post })
    const alreadyCommented = comments.find(
      c => c.author.toString() === userId.toString()
    )

    if (alreadyCommented) {
      throw new Error('You have already commented on this post')
    }
    return Comment.create({
      text,
      author: userId,
      post
    })
  }
}

export default Mutation
