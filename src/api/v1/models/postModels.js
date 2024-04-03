import { ASPECT_TYPES, pool } from '../../../config/index.js'
import { AppError } from '../../helpers/AppError.js'

// TODO: replace tempCurrUserId with that from the jwt
const tempCurrUserId = 'KrMUeta4ji'

const create = async ({ id, title, body, categoryId, slug, authorId }) => {
  const postQuery = `INSERT INTO aspect
                (id, aspect_type_id, title, body, category_id, slug, author_id)
                VALUES ($1, $2, $3, $4, $5, $6, $7)
                RETURNING
                id,
                title,
                body,
                category_id AS "categoryId",
                slug,
                author_id AS "authorId",
                vote_count AS "voteCount",
                comment_count AS "commentCount",
                created_at AS "createdAt",
                updated_at AS "updatedAt",
                reported_at AS "reportedAt";`
  // TODO: replace tempCurrUserId with that from the jwt
  const { rows: [postData] } = await pool.query(postQuery, [id, ASPECT_TYPES.POST, title, body, categoryId, slug, tempCurrUserId])

  const extraDataQuery = `SELECT
                            username AS authorUsername
                          FROM "user" U
                          WHERE U.id = $1;`
  // TODO: replace tempCurrUserId with that from the jwt
  const { rows: [extraData] } = await pool.query(extraDataQuery, [tempCurrUserId])
  return { ...postData, ...extraData, voteDirection: 0 }
}

const getById = async ({ postId, currUserId }) => {
  const selectPost = `SELECT
                        A.id,
                        A.title,
                        A.body,
                        A.category_id AS "categoryId",
                        A.slug,
                        A.author_id AS "authorId",
                        U.username,
                        U.avatar_url AS "avatarUrl",
                        A.vote_count AS "voteCount",
                        A.comment_count AS "commentCount",
                        A.created_at AS "createdAt",
                        A.updated_at AS "updatedAt",
                        A.reported_at AS "reportedAt",
                        U.deleted_at AS "userDeletedAt"
                      FROM aspect A
                      LEFT JOIN "user" U
                      ON A.author_id = U.id
                      WHERE A.id = $1
                      AND A.deleted_at IS NULL;`

  const { rows: [rawPostData] } = await pool.query(selectPost, [postId])

  if (rawPostData === undefined) {
    throw AppError.notFound('La publicación no existe')
  }

  const selectVoteDirection = `SELECT
                                V.vote_direction AS "voteDirection"
                              FROM "user" U
                              LEFT JOIN vote V
                              ON U.id = V.user_id
                              WHERE U.id = $1
                              AND V.aspect_id = $2;`
  // TODO: replace tempCurrUserId with that from the jwt
  const { rows: [vote] } = await pool.query(selectVoteDirection, [tempCurrUserId, postId])
  rawPostData.voteDirection = vote?.voteDirection || 0

  if (rawPostData.userDeletedAt) {
    rawPostData.authorId = null
    rawPostData.username = null
    rawPostData.avatarUrl = null
  }

  const { userDeletedAt, ...visiblePostData } = rawPostData

  return visiblePostData
}

export { create, getById }
