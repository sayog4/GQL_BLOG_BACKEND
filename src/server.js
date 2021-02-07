import { GraphQLServer } from 'graphql-yoga'
import cors from 'cors'
import dotenv from 'dotenv'
dotenv.config()
import connectDB from './db/db'
import model from './models'
import resolvers from './resolvers'

connectDB()

const server = new GraphQLServer({
  resolvers,
  typeDefs: './src/schema.graphql',
  context: req => {
    return {
      req,
      model
    }
  }
})
server.express.use(cors())

server.start({ endpoint: '/graphql', port: process.env.PORT || 4000 }, server =>
  console.log(`GQL SERVER IS RUNNING!!!!! ON http://localhost:${server.port}`)
)
