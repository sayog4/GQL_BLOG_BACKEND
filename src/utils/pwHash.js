import bcrypt from 'bcryptjs'

const pwHash = password => {
  if (password.length < 6) {
    throw new Error('Password must be longer than 6 characters')
  }

  return bcrypt.hash(password, 10)
}

export default pwHash
