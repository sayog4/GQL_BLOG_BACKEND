const Post = {
  async author(parent, args, { model: { User } }, info) {
    return User.findById(parent.author)
  },
  async comment(parent, args, { model: { Comment } }, info) {
    return Comment.find({ post: parent._id })
  }
}

export default Post
