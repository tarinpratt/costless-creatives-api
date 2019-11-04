const xss = require('xss')

const ProfileService = {
    getAllProfiles(knex) {
        return knex.select('*')
            .from('profile')
      }, 
    getById(db, id) {
        return db
            .from('profile')
            .select('*')
            .where('id', id)
            .first()
    },
    insertProfile(db, newProfile) {
        return db
            .insert(newProfile)
            .into('profile')
            .returning('*')
            .then(rows => {
                return rows[0]
            })
    },
    getProfileByUser(knex, user_id){
        return knex('profile')
            .where({ user_id })
    },
    deleteProfile(knex, id) {
        return knex('profile')
          .where({ id })
          .delete()
      },
    updateProfile(knex, id, newProfileFields) {
        return knex('profile')
            .where({ id })
            .update(newProfileFields)
    }, 
    serializeProfile(profile) {
        return {
          id: profile.id,
          profile_pic: xss(profile.profile_pic),
          bio: xss(profile.bio),
          user_id: profile.user_id
          }
        }, 
    }

module.exports = ProfileService