const { expect } = require('chai')
const knex = require('knex')
const app = require('../src/app')
const helpers = require('./test-helpers')
const jwt = require('jsonwebtoken')

describe('Posts Endpoints', function() {
    let db 
    const { testUsers, testProfiles, testPosts } = helpers.makeFixtures()
    function makeAuthHeader(user, secret = process.env.JWT_SECRET) {
        const token = jwt.sign(
            { user_id: user.id },
             secret,
            { subject: user.username,
              algorithm: 'HS256', }
            )
           return `Bearer ${token}`
        }
    before('make knex instance', () => {
        db = knex({
          client: 'pg',
          connection: process.env.TEST_DATABASE_URL,
        })
        app.set('db', db)
      })
       after('disconnect from db', () => db.destroy())
       before('cleanup', () => helpers.cleanTables(db))
       afterEach('cleanup', () => helpers.cleanTables(db))
    describe(`Protected Endpoints`, () => {
    const protectedEndpoints = [
        {
            name: 'GET /api/posts',
            path: '/api/posts'
        },
        {
            name: 'GET /api/posts/:posts_id',
            path: '/api/posts/1'
        },
        {
            name:'POST /api/posts',
            path: '/api/posts'
        },
        {
            name: `DELETE /api/posts/:posts_id`,
            path: '/api/posts/1'
        },
        {
            name: `PATCH /api/posts/:posts_id`,
            path: '/api/posts/1'
        }
    ]
    protectedEndpoints.forEach(endpoint => { 
    describe(endpoint.name, () => {
        it(`responds w 401 'missing bearer token when no basic token`,() => {
            return supertest(app)
                .get(endpoint.path)
                .expect(401, { error: `Missing bearer token` })   
        })
        it(`responds 401 'unauthorized request' when invalid JWT secret`, () => {
            const validUser = testUsers[0]
            const invalidSecret = 'bad-secret'
            return supertest(app)
                .get(endpoint.path)
                .set('Authorization', makeAuthHeader(validUser, invalidSecret))
                .expect(401, { error: `Unauthorized request` })
        })
        it(`responds 401 'Unauthorized request' when invalid sub in payload`, () => {
            const invalidUser = { username: 'user-not-existy', id: 1 }
            return supertest(app)
                    .get(endpoint.path)
                    .set('Authorization', makeAuthHeader(invalidUser))
                    .expect(401, { error: `Unauthorized request` })
                })
            })
        })
    describe(`GET /api/posts`, () => {
        context(`given no posts`, () => {
            beforeEach('insert posts', () => 
            helpers.seedUsers(
                db,
                testUsers,
            )
            )
        it(`responds with 200 and an empty list`, () => {
            return supertest(app)
                .get(`/api/posts`)
                .set('Authorization', makeAuthHeader(testUsers[0]))
                .expect(200, [])
            })
        })
        context(`given there are posts in the db`, () => {
            beforeEach('insert entries', () => 
                helpers.seedTable(
                    db,
                    testUsers,
                    testProfiles,
                    testPosts
            )
        )     
        it(`responds w 200 and all of the posts`, () => {
                 return supertest(app)
                   .get('/api/posts')
                   .set('Authorization', makeAuthHeader(testUsers[0]))
                   .expect(200) 
                })
            })
        })
    describe(`GET /api/posts/:posts_id`, () => {
        context('Given there are posts in the database', () => {
            const testUser = testUsers[0]
        context(`Given an XSS attack entry`, () => {
            const maliciousEntry = {
                        id: 911,
                        description: 'Naughty naughty very naughty <script>alert("xss");</script>',
                        project_pic: `Bad image <img src="https://url.to.file.which/does-not.exist" onerror="alert(document.cookie);">. But not <strong>all</strong> bad.`,
                        user_id: testUser.id
                    }
            beforeEach('insert malicious entry', () => {
                return db
                    .into('posts')
                    .insert([maliciousEntry])
                })
        it('removes XSS attack content', () => {
                return supertest(app)
                    .get(`/api/posts/${maliciousEntry.id}`)
                    .set('Authorization', makeAuthHeader(testUsers[0]))
                    .expect(200)
                    .expect(res => {
                        expect(res.body.description).to.eql('Naughty naughty very naughty &lt;script&gt;alert(\"xss\");&lt;/script&gt;')
                        expect(res.body.project_pic).to.eql(`Bad image <img src="https://url.to.file.which/does-not.exist">. But not <strong>all</strong> bad.`)
                        expect(res.body.user_id).to.eql(testUser.id)
                    })
                })
            })
                beforeEach('insert entries', () => 
                helpers.seedTable(
                    db,
                    testUsers,
                    testProfiles,
                    testPosts
                    )
                )
        it('responds with 200 and the specified profile', () => {
            const postId = 2
            const expectedPost= testPosts[postId - 1]
            return supertest(app)
                .get(`/api/posts/${postId}`)
                .set('Authorization', makeAuthHeader(testUsers[0]))
                .expect(200, expectedPost)
                })
            })
        })
    describe(`POST /api/posts`, () => {
            beforeEach('insert posts', () => 
                helpers.seedUsers(
                    db,
                    testUsers
                )
            )
        const testUser = testUsers[0]
        it(`creates an entry responding w 201 and the new entry`, () => {
              const newPost= {
                project_pic: 'https://i.imgur.com/TZtcMca.jpg',
                description: 'new description',
                user_id: testUser.id,
              }
              return supertest(app)
                .post('/api/posts')
                .set('Authorization', makeAuthHeader(testUsers[0]))
                .send(newPost)
                .expect(res => {
                    expect(res.body.project_pic).to.eql(newPost.project_pic)
                    expect(res.body.description).to.eql(newPost.description)
                    expect(res.body.user_id).to.eql(testUser.id)
                    expect(res.body).to.have.property('id')
                    expect(res.headers.location).to.eql(`/api/posts/${res.body.id}`)
                })
                .then(res => 
                        supertest(app)
                            .get(`/api/posts/${res.body.id}`)
                            .set('Authorization', makeAuthHeader(testUsers[0]))
                            .expect(res.body)
                            )
          })
          const requiredFields = ['description']
          requiredFields.forEach(field => {
              const newPost= {
                description: 'new bio'
              }   
        it(`responds w 400 and an error message when the ${field} is missing `, () => {
            delete newPost[field]

            return supertest(app)
            .post('/api/posts')
            .set('Authorization', makeAuthHeader(testUsers[0]))
            .send(newPost)
            .expect(400, {
                error: { message: `Missing key and value in request body` }
                })
            })
        })
    })
    describe(`DELETE /api/posts/:posts_id`, () => {
        context(`Given no posts`, () => {
          beforeEach('insert posts', () =>
          helpers.seedUsers(
              db,
              testUsers
            )
        )
        it(`responds with 404`, () => {
            const postId = 0000
                return supertest(app)
                    .delete(`/api/posts/${postId}`)
                    .set('Authorization', makeAuthHeader(testUsers[0]))
                    .expect(404, { 
                        error: { message: `post does not exist` }
                    })
                })
            })
        context('Given there are posts in the db', () => {
            beforeEach('insert posts', () =>
            helpers.seedTable(
                db,
                testUsers,
                testProfiles,
                testPosts  
            )
            )
        it('responds w 204 and removes the entry', () => {
            const idToRemove = 2
            const expectedPosts = testPosts.filter(post => post.id !== idToRemove)
                return supertest(app)
                    .delete(`/api/posts/${idToRemove}`)
                    .set('Authorization', makeAuthHeader(testUsers[0]))
                    .expect(204)
                    .then(res => {
                        supertest(app)
                            .get('/api/posts')
                            .expect(expectedPosts)
                        })
                    })
                })
            })
    describe(`PATCH /api/posts/:posts_id`, () => {
        context(`Given no posts`, () => {
            beforeEach('insert posts', () =>
            helpers.seedUsers(
                db,
                testUsers
            )
        )
        it(`responds w 404`, () => {
            const postId = 0000
            return supertest(app)
            .patch(`/api/posts/${postId}`)
            .set('Authorization', makeAuthHeader(testUsers[0]))
            .expect(404, { 
                error: { message: `post does not exist` }
                })
            })
        })
        context('Given there are posts in the db', () => {
            beforeEach('insert posts', () =>
            helpers.seedTable(
                db,
                testUsers,
                testProfiles,
                testPosts
            )
        )
        it('responds w 204 and updated appt', () => {
            const idToUpdate = 2
            const testUser = testUsers[1]
            const updatePost= {
                project_pic: 'https://i.imgur.com/LcoNgt8.jpg',
                description: 'updated description',
                user_id: 1
    
            }
            const expectedPost = {
                ...testPosts[idToUpdate - 1],
                ...updatePost
            }
            return supertest(app)
                .patch(`/api/posts/${idToUpdate}`)
                .set('Authorization', makeAuthHeader(testUsers[0]))
                .send(updatePost)
                .expect(204)
                .then(res => 
                    supertest(app)
                    .get(`/api/posts/${idToUpdate}`)
                    .set('Authorization', makeAuthHeader(testUsers[0]))
                    .expect(expectedPost))
            })
        it(`responds w 400 when no required fields are supplied`, () => {
            const idToUpdate = 2
            return supertest(app)
                .patch(`/api/posts/${idToUpdate}`)
                .set('Authorization', makeAuthHeader(testUsers[0]))
                .send({ irrelevantField: 'foo'})
                .expect(400, {
                    error: {message: `request body must contain date, description, project_pic`}
                })
            })
        it(`responds w 204 when updating only a subset of fields`, () => {
            const idToUpdate = 2
            const updatePost = {
                project_pic: 'https://i.imgur.com/LcoNgt8.jpg',
                user_id: 1
            }
            const expectedPost = {
                ...testPosts[idToUpdate -1 ],
                ...updatePost
            }
            return supertest(app)
                .patch(`/api/posts/${idToUpdate}`)
                .set('Authorization', makeAuthHeader(testUsers[0]))
                .send({
                    ...updatePost,
                    fieldToIgnore: 'should not be in GET response'
                })
                .expect(204)
                .then(res => 
                    supertest(app)
                    .get(`/api/posts/${idToUpdate}`)
                    .set('Authorization', makeAuthHeader(testUsers[0]))
                    .expect(expectedPost)
                    )
                    })
                })
            })
        })
    })