import mongoose from 'mongoose'

const blogSchema = mongoose.Schema(
  {
    title: {
      type: String,
      trim: true,
      min: 3,
      max: 160,
      required: true
    },
    slug: {
      type: String,
      unique: true,
      index: true
    },
    body: {
      type: String,
      trim: true,
      min: 200,
      required: true
    },
    excerpt: {
      type: String,
      max: 600
    },
    mtitle: {
      type: String
    },
    mdesc: {
      type: String
    },
    image: {
      type: String,
      required: true
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    comment: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Comment'
    }
  },
  {
    timestamps: true
  }
)

const Blog = mongoose.model('Blog', blogSchema)

export default Blog
