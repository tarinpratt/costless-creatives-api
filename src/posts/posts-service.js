
const PostsService = {

    getAllEntries(db) {
        return db
        .from('posts AS p')
        .select(
            'p.id',
            'p.date',
            'p.project_pic',
            'p.description',
            db.raw(
                `json_strip_nulls(
                json_build_object(
                    'id', usr.id,
                    'username', usr.username,
                    'email', usr.email
                    )
                    ) AS "user"`
                    ),
                    )
        .join('users as usr',
        'p.user_id',
        'usr.id',
        )
        .groupBy('p.id', 'p.user_id', 'usr.id')
        .orderBy('p.id', 'asc')

    },
    getAllPosts(knex) {
        return knex.select('*')
            .from('posts')
      }, 
      getById(db, id) {
        return db
            .from('posts')
            .select('*')
            .where('id', id)
            .first()
      },
    insertPost(db, newPost) {
        return db
            .insert(newPost)
            .into('posts')
            .returning('*')
            .then(rows => {
                return rows[0]
            })
    },
    getPostByUser(knex, user_id){
        return knex('posts')
            .where({ user_id })
    },
    deletePost(knex, id) {
        return knex('posts')
          .where({ id })
          .delete()
      },
    updatePost(knex, id, newPostFields) {
        return knex('posts')
            .where({ id })
            .update(newPostFields)
    }
}


module.exports = PostsService