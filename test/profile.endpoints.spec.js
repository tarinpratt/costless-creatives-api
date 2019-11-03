const { expect } = require('chai')
const knex = require('knex')
const app = require('../src/app')
const helpers = require('./test-helpers')
const jwt = require('jsonwebtoken')


describe('Profile Endpoints', function() {
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
                name: 'GET /api/profile',
                path: '/api/profile'
            },
            {
                name: 'GET /api/profile/:profile_id',
                path: '/api/profile/1'
            },
            {
                name:'POST /api/profile',
                path: '/api/profile'
            },
            {
                name: `DELETE /api/profile/:profile_id`,
                path: '/api/profile/1'
            },
            {
                name: `PATCH /api/profile/:profile_id`,
                path: '/api/profile/1'
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



    describe(`GET /api/profile`, () => {
        context(`given no profiles`, () => {
            beforeEach('insert profiles', () => 
            helpers.seedUsers(
                db,
                testUsers,
            )
            )
        it(`responds with 200 and an empty list`, () => {
            return supertest(app)
                .get(`/api/profile`)
                .set('Authorization', makeAuthHeader(testUsers[0]))
                .expect(200, [])
            })
        })

        context(`given there are profiles in the db`, () => {
            beforeEach('insert entries', () => 
                helpers.seedTable(
                    db,
                    testUsers,
                    testProfiles,
                    testPosts
            )
        )
              
        it(`responds w 200 and all of the profiles`, () => {
                 return supertest(app)
                   .get('/api/profile')
                   .set('Authorization', makeAuthHeader(testUsers[0]))
                   .expect(200) 
                })
            })
        })

        describe(`GET /api/profile/:profile_id`, () => {
            context('Given there are profiles in the database', () => {
                const testUser = testUsers[0]
                context(`Given an XSS attack entry`, () => {
                    const maliciousEntry = {
                                id: 911,
                                bio: 'Naughty naughty very naughty <script>alert("xss");</script>',
                                profile_pic: `Bad image <img src="https://url.to.file.which/does-not.exist" onerror="alert(document.cookie);">. But not <strong>all</strong> bad.`,
                                user_id: testUser.id
                            }
                    beforeEach('insert malicious entry', () => {
                        return db
                            .into('profile')
                            .insert([maliciousEntry])
                        })
                it('removes XSS attack content', () => {
                        return supertest(app)
                            .get(`/api/profile/${maliciousEntry.id}`)
                            .set('Authorization', makeAuthHeader(testUsers[0]))
                            .expect(200)
                            .expect(res => {
                                expect(res.body.bio).to.eql('Naughty naughty very naughty &lt;script&gt;alert(\"xss\");&lt;/script&gt;')
                                expect(res.body.profile_pic).to.eql(`Bad image <img src="https://url.to.file.which/does-not.exist">. But not <strong>all</strong> bad.`)
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
                const profileId = 2
                const expectedProfile= testProfiles[profileId - 1]
                return supertest(app)
                  .get(`/api/profile/${profileId}`)
                  .set('Authorization', makeAuthHeader(testUsers[0]))
                  .expect(200, expectedProfile)
              })
            })
          })
          describe(`POST /api/profile`, () => {
            beforeEach('insert profiles', () => 
                helpers.seedUsers(
                    db,
                    testUsers
                )
            )
        const testUser = testUsers[0]

        it(`creates an entry responding w 201 and the new entry`, () => {
              const newProfile= {
                profile_pic: 'https://i.imgur.com/TZtcMca.jpg',
                bio: 'new bio',
                user_id: testUser.id,
              }
              return supertest(app)
                .post('/api/profile')
                .set('Authorization', makeAuthHeader(testUsers[0]))
                .send(newProfile)
                .expect(res => {
                    expect(res.body.profile_pic).to.eql(newProfile.profile_pic)
                    expect(res.body.bio).to.eql(newProfile.bio)
                    expect(res.body.user_id).to.eql(testUser.id)
                    expect(res.body).to.have.property('id')
                    expect(res.headers.location).to.eql(`/api/profile/${res.body.id}`)
                })
                .then(res => 
                        supertest(app)
                            .get(`/api/profile/${res.body.id}`)
                            .set('Authorization', makeAuthHeader(testUsers[0]))
                            .expect(res.body)
                            )
          })

          const requiredFields = ['profile_pic', 'bio']
          requiredFields.forEach(field => {
              const newProfile = {
                profile_pic: 'https://i.imgur.com/TZtcMca.jpg',
                bio: 'new bio'
              }
          
          it(`responds w 400 and an error message when the ${field} is missing `, () => {
              delete newProfile[field]

              return supertest(app)
                .post('/api/profile')
                .set('Authorization', makeAuthHeader(testUsers[0]))
                .send(newProfile)
                .expect(400, {
                    error: { message: `Missing key and value in request body` }
                })
          })
      })
      context(`Given an XSS attack entry`, () => {
        const maliciousEntry = {
                    id: 911,
                    bio: 'Naughty naughty very naughty <script>alert("xss");</script>',
                    profile_pic: `Bad image <img src="https://url.to.file.which/does-not.exist" onerror="alert(document.cookie);">. But not <strong>all</strong> bad.`,
                    user_id: testUser.id
                }
        beforeEach('insert malicious entry', () => {
            return db
                .into('profile')
                .insert([maliciousEntry])
            })
    it('removes XSS attack content', () => {
            return supertest(app)
                .get(`/api/profile/${maliciousEntry.id}`)
                .set('Authorization', makeAuthHeader(testUsers[0]))
                .expect(200)
                .expect(res => {
                    expect(res.body.bio).to.eql('Naughty naughty very naughty &lt;script&gt;alert(\"xss\");&lt;/script&gt;')
                    expect(res.body.profile_pic).to.eql(`Bad image <img src="https://url.to.file.which/does-not.exist">. But not <strong>all</strong> bad.`)
                    expect(res.body.user_id).to.eql(testUser.id)
                })
            })
        })
    })

    describe(`DELETE /api/profile/:profile_id`, () => {
        context(`Given no profiles`, () => {
          beforeEach('insert profiles', () =>
          helpers.seedUsers(
              db,
              testUsers
          )
      )
      it(`responds with 404`, () => {
          const profileId = 0000
              return supertest(app)
                  .delete(`/api/profile/${profileId}`)
                  .set('Authorization', makeAuthHeader(testUsers[0]))
                  .expect(404, { 
                      error: { message: `profile does not exist` }
                  })
              })
        })
      context('Given there are profiles in the db', () => {
          beforeEach('insert entries', () =>
          helpers.seedTable(
            db,
            testUsers,
            testProfiles,
            testPosts  
          )
        )
      it('responds w 204 and removes the entry', () => {
          const idToRemove = 2
          const expectedProfiles = testProfiles.filter(profile => profile.id !== idToRemove)
              return supertest(app)
                  .delete(`/api/profile/${idToRemove}`)
                  .set('Authorization', makeAuthHeader(testUsers[0]))
                  .expect(204)
                  .then(res => {
                      supertest(app)
                          .get('/api/profile')
                          .expect(expectedProfiles)
                  })
             })
        })
    })

    })
})

   