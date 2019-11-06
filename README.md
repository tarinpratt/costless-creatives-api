# **Costless-Creatives-API**

Costless Creatives is a public board where users in the entertainment field can make profiles and posts, as well as communicate with other registered users via email. 

# Server Hosted here:

(https://aqueous-bayou-54903.herokuapp.com/)

# API Documentation

Users

* GET '/api/users to view all users

* GET '/api/users/:user_id retrieves user by id

* POST '/api/users creates a new user account

Posts

* GET '/api/posts view all posts for specified user

* GET '/api/posts/:post_id gets a single post by id

* POST '/api/posts to make a new post

* PATCH '/api/posts/:post_id to update an exisiting post

* DELETE '/api/posts/:post_id to delete a post

Profiles

* GET '/api/profile view all profiles

* GET '/api/profile/:profile_id gets a single profile by id

* POST '/api/profile to post a new profile

* PATCH '/api/profile/:profile_id updates an exisiting profile

* DELETE '/api/profile/:profile_id to delete an profile

Authentication

* POST '/api/auth/login matches given credentials and provides a JWT token
`//req.body
{
    username: string
    password: string
}
//res.body
{
  authToken: String
}`


# Technology Used 

* Node.js
* Express
* Mocha
* Chai
* Postgres
* Knex.js
* Supertest

# Security 

Application uses JWT authentication