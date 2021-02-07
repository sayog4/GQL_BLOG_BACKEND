import mongoose from 'mongoose'
import bcrypt from 'bcryptjs'

const userSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true
    },
    email: {
      type: String,
      required: true
    },
    password: {
      type: String,
      required: true
    },
    comments: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Comment'
    },
    posts: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Post'
    }
  },
  {
    timestamps: true
  }
)

userSchema.methods.matchPassword = async function(enteredPw) {
  return await bcrypt.compare(enteredPw, this.password)
}

userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) {
    next()
  }

  const salt = await bcrypt.genSalt(10)

  this.password = await bcrypt.hash(this.password, salt)
})

const User = mongoose.model('User', userSchema)

export default User
