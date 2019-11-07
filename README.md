# **Costless-Creatives-API**

Costless Creatives is a public board where users in the entertainment field can make profiles and posts, as well as communicate with other registered users via email. 

# Server Hosted here:

(https://aqueous-bayou-54903.herokuapp.com/)

# API Documentation

# Users

**GET '/api/users to view all users**

![Costless Creatives screenshot](/src/images/getallusers.png)

**GET '/api/users/:user_id retrieves user by id**

![Costless Creatives screenshot](/src/images/getuserbyid.png)

**POST '/api/users creates a new user account**

![Costless Creatives screenshot](/src/images/postnewuser.png)

# Posts

**GET '/api/posts view all posts from all users**

![Costless Creatives screenshot](/src/images/getposts.png)

**GET '/api/posts/:post_id gets a single post by user id**

![Costless Creatives screenshot](/src/images/getpostsbyid.png)

**POST '/api/posts to make a new post**

![Costless Creatives screenshot](/src/images/newpost.png)

**PATCH '/api/posts/:post_id to update an exisiting post**

![Costless Creatives screenshot](/src/images/updatepost.png)

**DELETE '/api/posts/:post_id to delete a post**

![Costless Creatives screenshot](/src/images/deletepost.png)

# Profiles

**GET '/api/profile gets the profile of the signed in user**

![Costless Creatives screenshot](/src/images/getprofilebyuser.png)

**GET '/api/profile/:profile_id gets a single profile by id**

![Costless Creatives screenshot](/src/images/getprofilebyid.png)

**POST '/api/profile to post a new profile**

![Costless Creatives screenshot](/src/images/postprofile.png)

**PATCH '/api/profile/:profile_id updates an exisiting profile**

![Costless Creatives screenshot](/src/images/patchprofile.png)

**DELETE '/api/profile/:profile_id to delete an profile**

![Costless Creatives screenshot](/src/images/deleteprofile.png)

# Authentication

**POST '/api/auth/login matches given credentials and provides a JWT token**

![Costless Creatives screenshot](/src/images/postauthlogin.png)


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