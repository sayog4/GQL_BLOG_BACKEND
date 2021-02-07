const Comment = {
  post(parent, args, { model: { Blog } }, info) {
    return Blog.findById(parent.post)
  },
  author(parent, args, { model: { User } }, info) {
    return User.findById(parent.author)
  }
}

export default Comment
