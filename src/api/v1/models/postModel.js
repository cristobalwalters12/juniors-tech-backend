import { ASPECT_TYPES, pool } from '../../../config/index.js'
import { AppError } from '../../helpers/AppError.js'

const create = async ({ postId, title, body, categoryId, slug, currUserId }) => {
  const insertPost = `INSERT INTO aspect
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
                        has_open_report AS "hasOpenReport";`
  const { rows: [postData] } = await pool.query(insertPost, [postId, ASPECT_TYPES.POST, title, body, categoryId, slug, currUserId])

  const updateAuthor = `UPDATE "user"
                        SET post_count = post_count + 1
                        WHERE id = $1
                        RETURNING username AS "authorUsername";`
  const { rows: [author] } = await pool.query(updateAuthor, [currUserId])

  return { ...postData, ...author, voteDirection: 0 }
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
                        A.has_open_report AS "hasOpenReport",
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

  rawPostData.voteDirection = 0
  if (currUserId !== undefined) {
    const selectVoteDirection = `SELECT
                                  V.vote_direction AS "voteDirection"
                                FROM vote V
                                WHERE V.user_id = $1
                                AND V.aspect_id = $2;`
    const { rows: [vote] } = await pool.query(selectVoteDirection, [currUserId, postId])
    if (vote) {
      rawPostData.voteDirection = vote?.voteDirection
    }
  }

  if (rawPostData.userDeletedAt) {
    rawPostData.authorId = null
    rawPostData.username = null
    rawPostData.avatarUrl = null
  }

  const { userDeletedAt, ...visiblePostData } = rawPostData

  return visiblePostData
}

const getAll = async ({ currUserId }) => {
  const selectPosts = `SELECT
                        A.id,
                        A.title,
                        A.body,
                        A.category_id AS "categoryId",
                        A.slug,
                        A.author_id AS "authorId",
                        U.username AS "authorUsername",
                        U.avatar_url AS "avatarUrl",
                        A.vote_count AS "voteCount",
                        A.comment_count AS "commentCount",
                        A.created_at AS "createdAt",
                        A.updated_at AS "updatedAt",
                        A.has_open_report AS "hasOpenReport",
                        U.deleted_at AS "userDeletedAt"
                      FROM aspect A
                      LEFT JOIN "user" U
                      ON A.author_id = U.id
                      WHERE A.deleted_at IS NULL;`

  const { rows: rawPostsData } = await pool.query(selectPosts)

  const postVotes = {}

  if (currUserId !== undefined) {
    const selectPostVotes = `SELECT
                              V.vote_direction AS "voteDirection",
                              V.aspect_id AS "aspectId"
                            FROM aspect A
                            JOIN vote V
                            ON A.id = V.aspect_id
                            WHERE A.aspect_type_id = $1
                            AND V.user_id = $2;`
    const { rows: rawPostsVotes } = await pool.query(selectPostVotes, [ASPECT_TYPES.POST, currUserId])

    rawPostsVotes.forEach(({ voteDirection, aspectId }) => {
      postVotes[aspectId] = voteDirection
    })
  }

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

const updateById = async ({ postId, title, body, categoryId, slug, currUserId }) => {
  const updatePost = `UPDATE aspect SET
                        title = $1,
                        body = $2,
                        category_id = $3,
                        slug = $4,
                        updated_at = NOW()
                      WHERE aspect.id = $5
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
                        has_open_report AS "hasOpenReport";`
  const { rows: [postData] } = await pool.query(updatePost, [title, body, categoryId, slug, postId])

  const selectUsername = `SELECT
                            username AS "authorUsername"
                          FROM "user" U
                          WHERE U.id = $1;`
  const { rows: [username] } = await pool.query(selectUsername, [postData.authorId])

  const selectVoteDirection = `SELECT
                                V.vote_direction AS "voteDirection"
                              FROM vote V
                              WHERE V.user_id = $1
                              AND V.aspect_id = $2;`
  const { rows: [vote] } = await pool.query(selectVoteDirection, [currUserId, postId])
  postData.voteDirection = vote?.voteDirection || 0

  return { ...postData, ...username }
}

const deleteById = async ({ postId }) => {
  const deletePost = `UPDATE aspect
                      SET deleted_at = NOW()
                      WHERE id = $1
                      OR post_id = $2
                      RETURNING author_id AS "authorId";`
  const { rows: [author] } = await pool.query(deletePost, [postId, postId])

  const updateAuthor = `UPDATE "user"
                        SET post_count = post_count - 1
                        WHERE id = $1;`
  await pool.query(updateAuthor, [author.authorId])
}

const existsById = async (postId) => {
  const selectPost = `SELECT
                        id,
                        author_id AS "authorId",
                        has_open_report AS "hasOpenReport"
                      FROM aspect
                      WHERE
                        id = $1
                        AND deleted_at IS NULL;`
  const { rows: [post] } = await pool.query(selectPost, [postId])
  return post
}

export { create, getById, getAll, updateById, deleteById, existsById }
