import { pool } from '../../../config/dbConnection.js'
import { ASPECT_TYPES } from '../../../config/dbConstants/entityTypeIds.js'

const create = async ({ id, postId, parentId, body, currUserId }) => {
  const insertComment = `INSERT INTO aspect
                          (id, aspect_type_id, post_id, parent_id, body, author_id)
                        VALUES ($1, $2, $3, $4, $5, $6)
                        RETURNING
                          id,
                          post_id AS "postId",
                          parent_id AS "parentId",
                          body,
                          author_id AS "authorId",
                          vote_count AS "voteCount",
                          comment_count AS "commentCount",
                          created_at AS "createdAt",
                          updated_at AS "updatedAt",
                          deleted_at AS "deletedAt",
                          has_open_report AS "hasOpenReport";`
  const { rows: [postData] } = await pool.query(insertComment, [id, ASPECT_TYPES.COMMENT, postId, parentId, body, currUserId])

  const updateAuthor = `UPDATE "user"
                        SET post_count = post_count + 1
                        WHERE id = $1
                        RETURNING
                          username AS "authorUsername",
                          avatar_url AS "avatarUrl";`
  const { rows: [author] } = await pool.query(updateAuthor, [currUserId])

  return { ...postData, ...author, voteDirection: 0 }
}

export { create }
