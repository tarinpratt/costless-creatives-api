const path = require('path')
const express = require('express')
const PostsService  = require('./posts-service')
const { requireAuth } = require('../middleware/jwt-auth')
const PostsRouter = express.Router()
const jsonParser = express.json()
const xss = require('xss')

const serializeEntry = entry => ({
    id: entry.id,
    date: entry.date,
    description: xss(entry.description),
    project_pic: xss(entry.project_pic),
    user_id: entry.user_id
})

PostsRouter   
.route('/')
.get(requireAuth, (req, res, next) => {
    const knexInstance = req.app.get('db')
    PostsService.getAllEntries(knexInstance)
      .then(posts => {
      res.json(posts)
      })
      .catch(next)
      })
.post(requireAuth, jsonParser, (req, res, next) => {
    const { project_pic, description } = req.body
    const newPost = { project_pic, description}
        if(!description) {
        return res.status(400).json({
        error: { message: `Missing key and value in request body` }
        })
        }
    newPost.user_id = req.user.id
    PostsService.insertPost(
        req.app.get('db'),
        newPost
        )
        .then(post => {
        res.status(201)
            .location(path.posix.join(req.originalUrl, `/${post.id}`))
            .json(serializeEntry(post))
            })
            .catch(next)
        })

PostsRouter
.route('/:post_id')
.all(requireAuth, (req, res, next) => {
    PostsService.getById(
      req.app.get('db'),
      req.params.post_id
    )
    .then(post => {     
    if (!post) {
    return res.status(404).json({
    error: { message: `post does not exist` }
    })
    }
    res.post = post
    next()
    })
    .catch(next)
    })
    .get((req, res) => { 
    res.json(serializeEntry(res.post))
    })    
.delete( (req, res, next) => {
    PostsService.deletePost(
        req.app.get('db'),
        req.params.post_id
    )
    .then(numRowsAffected => {
    if(numRowsAffected > 0 ) {
    res.status(204).end()
    } else {
    res.status(404).json({
    error: { message: `post does not exist` }
    })
    }
    })
    .catch(next)
  })
.patch( jsonParser, (req, res, next) => {
    const { date, description, project_pic } = req.body
    const postToUpdate = { date, description, project_pic}
    const numberOfValues = Object.values(postToUpdate).filter(Boolean).length
        if(numberOfValues === 0) {
        return res.status(400).json({
        error: {message : `request body must contain date, description, project_pic`}
        })
        }
    postToUpdate.user_id = req.user.id
    PostsService.updatePost(
        req.app.get('db'),
        req.params.post_id,
        postToUpdate
        )
        .then(numRowsAffected => {
        if(numRowsAffected > 0 ) {
        res.status(204).end()
        } else {
        res.status(404).json({
        error: { message: `post does not exist` }
        })
        }
        })
        .catch(next)
    })


module.exports = PostsRouter