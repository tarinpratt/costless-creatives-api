const bcrypt = require('bcryptjs')

function MakeUserArray() {
  return [
    {
      id: 1,
      username: 'DanceLyfe',
      email: 'email@gmail.com',
      password: '12345'
    },
    {
      id: 2,
      username: 'ReadHeadBeauty',
      email: 'email@gmail.com',
      password: '1234567Tp#'
    },
    {
      id: 3,
      username: 'JakeTheHairGuy',
      email: 'email@gmail.com',
      password: '1234567Tp#'
    },
    {
      id: 4,
      username: 'YouCanCallMeAl',
      email: 'email@gmail.com',
      password: '1234567Tp#'
    },
    {
      id: 4,
      username: 'JessLovesMakeUp',
      email: 'email@gmail.com',
      password: '1234567Tp#'
    }  
  ]
}

function makeFixtures() {
    const testUsers = MakeUserArray()
    return { testUsers}
}

function seedUsers(db, users) {
    const preppedUsers = users.map(user => ({
      ...user,
      password: bcrypt.hashSync(user.password, 1)
    }))
    return db.into('users').insert(preppedUsers)
      .then(() =>
        db.raw(
          `SELECT setval('users_id_seq', ?)`,
          [users[users.length - 1].id],
      )
    )
  }

  function cleanTables(db) {
    return db.raw(
      `TRUNCATE
      users
      RESTART IDENTITY CASCADE`
    )
  }

  module.exports = {
  seedUsers,
  makeFixtures,
  cleanTables,
  MakeUserArray
  }