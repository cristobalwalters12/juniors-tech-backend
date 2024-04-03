import { ASPECT_TYPES, pool } from '../../../config/index.js'

// TODO: replace author_id with that from the jwt
const tempAuthorId = 'KrMUeta4ji'

const create = async ({ id, title, body, categoryId, slug, authorId }) => {
  const postQuery = `INSERT INTO aspect
                (id, aspect_type_id, title, body, category_id, slug, author_id)
                VALUES ($1, $2, $3, $4, $5, $6, $7)
                RETURNING
                id,
                title,
                body,
                category_id as "categoryId",
                slug,
                author_id as "authorId",
                vote_count AS "voteCount",
                comment_count AS "commentCount",
                created_at AS "createdAt",
                updated_at AS "updatedAt",
                reported_at AS "reportedAt";`
  // TODO: replace tempAuthorId with that from the jwt
  const { rows: [postData] } = await pool.query(postQuery, [id, ASPECT_TYPES.POST, title, body, categoryId, slug, tempAuthorId])

  const extraDataQuery = `SELECT
                            username AS authorUsername
                          FROM "user" U
                          WHERE U.id = $1;`
  // TODO: replace author_id with that from the jwt
  const { rows: [extraData] } = await pool.query(extraDataQuery, [tempAuthorId])
  return { ...postData, ...extraData, voteDirection: 0 }
}

export { create }
