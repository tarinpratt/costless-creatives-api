const path = require('path')
const express = require('express')
const ProfileService  = require('./profile-service')
const { requireAuth } = require('../middleware/jwt-auth')
const ProfileRouter = express.Router()
const jsonParser = express.json()
const xss = require('xss')

const serializeEntry = entry => ({
    id: entry.id,
    profile_pic: xss(entry.profile_pic),
    bio: xss(entry.bio),
    user_id: entry.user_id
})

ProfileRouter   
.route('/')
.get(requireAuth, (req, res, next) => {
    const knexInstance = req.app.get('db')
    ProfileService.getProfileByUser(knexInstance, req.user.id)
      .then(profiles => {
      res.json(profiles)
      })
      .catch(next)
      })
.post(requireAuth, jsonParser, (req, res, next) => {
    const {profile_pic, bio} = req.body
    const newProfile = { profile_pic, bio }
        if(!profile_pic || !bio ) {
        return res.status(400).json({
        error: { message: `Missing key and value in request body` }
        })
        }
        newProfile.user_id = req.user.id
    ProfileService.insertProfile(
        req.app.get('db'),
        newProfile
        )
        .then(profile => {
        res.status(201)
            .location(path.posix.join(req.originalUrl, `/${profile.id}`))
            .json(serializeEntry(profile))
            })
            .catch(next)
            })

ProfileRouter
.route('/:profile_id')
.all(requireAuth, (req, res, next) => {
    ProfileService.getById(
      req.app.get('db'),
      req.params.profile_id
    )
    .then(profile => {
    if (!profile) {
    return res.status(404).json({
    error: { message: `profile does not exist` }
    })
    }
    res.profile = profile
    next()
    })
    .catch(next)
    })
    .get((req, res) => { 
    res.json(serializeEntry(res.profile))
    })       
.delete( (req, res, next) => {
    ProfileService.deleteProfile(
        req.app.get('db'),
        req.params.profile_id
    )
    .then(numRowsAffected => {
    if(numRowsAffected > 0 ) {
    res.status(204).end()
    } else {
    res.status(404).json({
    error: { message: `profile does not exist` }
    })
    }
    })
    .catch(next)
  })

.patch( jsonParser, (req, res, next) => {
    const { profile_pic, bio } = req.body
    const profileToUpdate = { profile_pic, bio }
    const numberOfValues = Object.values(profileToUpdate).filter(Boolean).length
        if(numberOfValues === 0) {
        return res.status(400).json({
        error: {message : `request body must contain profile_pic, bio`}
        })
        }
    profileToUpdate.user_id = req.user.id
    ProfileService.updateProfile(
        req.app.get('db'),
        req.params.profile_id,
        profileToUpdate
        )
        .then(numRowsAffected => {
        if(numRowsAffected > 0 ) {
        res.status(204).end()
        } else {
        res.status(404).json({
        error: { message: `entry does not exist` }
        })
        }
        })
        .catch(next)
    })

module.exports = ProfileRouter