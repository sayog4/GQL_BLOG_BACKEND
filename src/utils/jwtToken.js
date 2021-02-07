import jwt from 'jsonwebtoken'

const jwtToken = userId => jwt.sign({ userId }, process.env.JWT_SECRET)

export default jwtToken
