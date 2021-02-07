import jwt from 'jsonwebtoken'

const getUserId = req => {
  const header = req.request.headers.authorization
  if (header) {
    const token = header.replace('Bearer ', '')
    const { userId } = jwt.verify(token, process.env.JWT_SECRET)
    return userId
  }
}

export default getUserId
