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
      id: 5,
      username: 'JessLovesMakeUp',
      email: 'email@gmail.com',
      password: '1234567Tp#'
    }  
  ]
}

function MakeProfileArray(users) {
return [
  {
      id: 1,
      profile_pic: "https://i.imgur.com/TZtcMca.jpg",
      bio: "Hey my name is Kat and I'm a professional dancer/choreographer in LA. I'm really trying to broaden my career in choreography currently and I'm trying to collect as much footage as I can. If you're a dancer looking to practice dancing on film, hit me up! I film combos all of the time!",
      user_id: users[0].id
  },
  {
      id: 2,
      profile_pic: "https://i.imgur.com/M9nwgOo.jpg",
      bio: "Hey, I'm Rebecca. New to the Los Angeles area and fulfilling my modeling career. Looking for photographers who are open for abstract shoots.",
      user_id: users[1].id
  },
  {
      id: 3,
      profile_pic: "https://i.imgur.com/MNnNAh2.jpg",
      bio: "HairStylist at SalonCentric. Always looking for open minded models to experiment on!",
      user_id: users[2].id
  },
  {
      id: 4,
      profile_pic: "https://i.imgur.com/qWAXea9.jpg",
      bio: "Aspiring singer in North Hollywood. ALWAYS down to collab with other musicians. Shoot me your info!",
      user_id: users[3].id
  },
  {
      id: 5,
      profile_pic: "https://i.imgur.com/8mTnt5i.jpg",
      bio: "MUA at Sephora. Trying to put together look books and gain exposure to eventually work on film.",
      user_id: users[4].id
  }
]
}

function MakePostsArray(users) {
  return [
    {
      id: 1,
      date: '2019-11-02T04:16:57.238Z',
      description: 'Im looking to shoot a video this weekend with 3 dancers. The choreo will be in heels and super classy. My friend is a videographer and will be shooting the vid, so it will be good quality footage to have in the future. Message me if interested!',
      project_pic: 'https://i.imgur.com/c4ZeRVh.jpg',
      user_id: users[0].id
    },
    {
      id: 2,
      date: '2019-11-02T04:16:57.238Z',
      description: 'Hi all! Im a model who just moved to LA and am looking for a photographer who might want to collab for headshots! Hit me up!',
      project_pic: 'https://i.imgur.com/Aon6qga.jpg',
      user_id: users[1].id
    },
    {
      id: 3,
      date: '2019-11-02T04:16:57.238Z',
      description: 'Hi guys. Lookin for a hair model who wouldnt mind me doing a pixie cut, and maybe dying it blue. Hit me up.',
      project_pic: 'https://i.imgur.com/tYI9qGX.jpg',
      user_id: users[2].id
    },
    {
      id: 4,
      date: '2019-11-02T04:16:57.238Z',
      description: 'What up everyone. Im looking for someone to shoot me singing a single I just wrote. I just need some nice quality content that I can use to promote. Thanks!',
      project_pic: 'https://i.imgur.com/LcoNgt8.jpg',
      user_id: users[3].id
    },
    {
      id: 5,
      date: '2019-11-02T04:16:57.238Z',
      description: 'Hey Guys! Looking for some models down to get their make up done and willing shoot for my portfolio! Gunna be a glam theme. Let me know!',
      project_pic: 'https://i.imgur.com/nv7hhUf.jpg',
      user_id: users[4].id
    },
  ]
}


function MakeExpectedProfile(users, profile) {
  const user = users
    .find(user => user.id === profile.user_id)
  return {
    id: profile.id,
    profile_pic: profile.profile_pic,
    bio: profile.bio,
    user_id: profile.user_id
  }
}

function MakeExpectedPost(users, posts) {
  const user = users
    .find(user => user.id === posts.user_id)
  return {
    id: posts.id,
    project_pic: posts.project_pic,
    description: posts.description,
    user_id: posts.user_id
  }
}
function makeFixtures() {
    const testUsers = MakeUserArray()
    const testProfiles = MakeProfileArray(testUsers)
    const testPosts = MakePostsArray(testUsers)
    return { testUsers, testProfiles, testPosts }
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
      posts,
      profile,
      users
      RESTART IDENTITY CASCADE`
    )
  }

  function seedTable(db, users, profile, posts) {
    const preppedUsers = users.map(user => ({
        ...user,
        password: bcrypt.hashSync(user.password, 1)
      }))
    return db.transaction(async trx => {
      await trx.into('users').insert(preppedUsers)
      await trx.raw(
          `SELECT setval('users_id_seq', ?)`,
          [users[users.length - 1].id],
      )
      await trx.into('profile').insert(profile)      
      await trx.raw(
                `SELECT setval('profile_id_seq', ?)`,
                [profile[profile.length - 1].id],
              )
      await trx.into('posts').insert(posts)      
      await trx.raw(
                `SELECT setval('posts_id_seq', ?)`,
                [posts[posts.length - 1].id],
              )
    })
  }


  module.exports = {
  seedUsers,
  makeFixtures,
  cleanTables,
  seedTable,
  MakeUserArray,
  MakeProfileArray,
  MakePostsArray,
  MakeExpectedProfile,
  MakeExpectedPost
  }