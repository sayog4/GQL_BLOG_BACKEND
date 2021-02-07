const User = {
  async post(parent, args, { model: { Blog } }, info) {
    return Blog.find({ author: parent._id })
  },
  comment(parent, args, { model: { Comment } }, info) {
    return Comment.find({ author: parent._id })
  }
}

export default User
