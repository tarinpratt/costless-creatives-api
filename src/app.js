require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const helmet = require('helmet')
const winston = require('winston');
const { NODE_ENV } = require('./config')
const UsersRouter = require('./users/user-router')
const AuthRouter = require('./auth/auth-router')
const ProfileRouter =  require('./profile/profile-router')
const PostsRouter = require('./posts/posts-router')


const app = express()

const morganOption = (NODE_ENV === 'production')
  ? 'tiny'
  : 'common';

app.use(morgan(morganOption))
app.use(cors())
app.use(helmet())
app.use(express.json());


app.use('/api/users', UsersRouter)
app.use('/api/auth', AuthRouter)
app.use('/api/profile', ProfileRouter)
app.use('/api/posts', PostsRouter)


app.get('/', (req, res) => {
      res.send('Hello, world!')
     })



app.use(function errorHandler(error, req, res, next) {
       let response
       if (NODE_ENV === 'production') {
         response = { error: { message: 'server error' } }
       } else {
         console.error(error)
         response = { message: error.message, error }
       }
       res.status(500).json(response)
     })
    

module.exports = app