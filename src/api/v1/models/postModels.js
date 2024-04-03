import { ASPECT_TYPES, pool } from '../../../config/index.js'
import { AppError } from '../../helpers/AppError.js'

// TODO: replace tempCurrUserId with that from the jwt
const tempCurrUserId = 'sYfjpcR8ge'

const create = async ({ id, title, body, categoryId, slug, currUserId }) => {
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
                              FROM vote V
                              WHERE V.user_id = $1
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

const getAll = async (currUserId) => {
  const selectPosts = `SELECT
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
                      WHERE A.deleted_at IS NULL;`

  const { rows: rawPostsData } = await pool.query(selectPosts)

  const selectPostVotes = `SELECT
                            V.vote_direction AS "voteDirection",
                            V.aspect_id AS "aspectId"
                          FROM aspect A
                          JOIN vote V
                          ON A.id = V.aspect_id
                          WHERE A.aspect_type_id = $1
                          AND V.user_id = $2;`
  // TODO: replace tempCurrUserId with that from the jwt
  const { rows: rawPostsVotes } = await pool.query(selectPostVotes, [ASPECT_TYPES.POST, tempCurrUserId])

  const postVotes = {}

  rawPostsVotes.forEach(({ voteDirection, aspectId }) => {
    postVotes[aspectId] = voteDirection
  })

  const visiblePostsData = rawPostsData.map(rawPost => {
    if (rawPost.userDeletedAt) {
      rawPost.authorId = null
      rawPost.username = null
      rawPost.avatarUrl = null
    }
    rawPost.voteDirection = postVotes[rawPost.id] || 0
    const { userDeletedAt, ...visiblePostData } = rawPost
    return visiblePostData
  })

  return visiblePostsData
}

const update = async ({ postId, title, body, categoryId, slug }) => {
  const updatePost = `UPDATE aspect SET
                        title = $1,
                        body = $2,
                        category_id = $3,
                        slug = $4
                      WHERE aspect.id = $5
                      RETURNING *`
  const { rows: [postData] } = await pool.query(updatePost, [title, body, categoryId, slug, postId])

  const selectUsername = `SELECT
                            username AS authorUsername
                          FROM "user" U
                          WHERE U.id = $1;`
  // TODO: replace tempCurrUserId with that from the jwt
  const { rows: [username] } = await pool.query(selectUsername, [tempCurrUserId])

  const selectVoteDirection = `SELECT
                                V.vote_direction AS "voteDirection"
                              FROM vote V
                              WHERE V.user_id = $1
                              AND V.aspect_id = $2;`
  // TODO: replace tempCurrUserId with that from the jwt
  const { rows: [vote] } = await pool.query(selectVoteDirection, [tempCurrUserId, postId])
  postData.voteDirection = vote?.voteDirection || 0

  return { ...postData, ...username }
}

export { create, getById, getAll, update }
