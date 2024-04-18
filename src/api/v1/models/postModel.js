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
                        P.id,
                        P.title,
                        P.body,
                        P.category_id AS "categoryId",
                        C.name AS category,
                        P.slug,
                        P.author_id AS "authorId",
                        U.username,
                        U.avatar_url AS "avatarUrl",
                        P.vote_count AS "voteCount",
                        P.comment_count AS "commentCount",
                        P.created_at AS "createdAt",
                        P.updated_at AS "updatedAt",
                        P.has_open_report AS "hasOpenReport",
                        U.deleted_at AS "userDeletedAt"
                      FROM aspect P
                      JOIN category C
                        ON P.category_id = C.id
                      LEFT JOIN "user" U
                        ON P.author_id = U.id
                      WHERE P.id = $1
                        AND P.deleted_at IS NULL;`

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

const getAll = async ({ sort, order, category, page, limit, currUserId }) => {
  const selectPosts = `WITH counted_posts AS (
                          SELECT
                            P.id,
                            P.title,
                            P.body,
                            P.category_id AS "categoryId",
                            C.name AS category,
                            P.slug,
                            P.author_id AS "authorId",
                            A.username AS "authorUsername",
                            A.avatar_url AS "avatarUrl",
                            P.vote_count AS post_vote_count,
                            P.comment_count AS "commentCount",
                            P.created_at AS post_created_at,
                            P.updated_at AS "updatedAt",
                            COALESCE(V.vote_direction, 0) AS "voteDirection",
                            P.has_open_report AS "hasOpenReport",
                            COUNT(P.id) OVER() as total
                          FROM aspect P
                          JOIN category C
                            ON P.category_id = C.id
                          JOIN "user" A
                            ON P.author_id = A.id
                          LEFT JOIN vote V
                            ON P.id = V.aspect_id AND V.user_id = $1
                          LEFT JOIN "user" U
                            ON U.id = V.user_id
                          WHERE (P.category_id = $2 OR $2 IS NULL OR $2 = '')
                            AND P.deleted_at IS NULL
                            AND P.deleted_at IS NULL
                          )
                        SELECT
                          *,
                          CP.post_vote_count AS "voteCount",
                          CP.post_created_at AS "createdAt",
                          CP.total::int
                        FROM counted_posts CP
                        ORDER BY post_${sort} ${order}
                        LIMIT ${limit}
                        OFFSET ${(page - 1) * limit};`
  const { rows } = await pool.query(selectPosts, [currUserId, category])
  if (rows.length === 0) {
    return {
      total: 0,
      page: 1,
      limit,
      posts: []
    }
  }

  const { total } = rows[0]
  const posts = rows.map(row => {
    const { total, post_vote_count: _pVC, post_created_at: _pCA, ...post } = row
    return post
  })

  return {
    total,
    page,
    limit,
    posts
  }
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

const deleteById = async (postId) => {
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
                        A.id,
                        A.author_id AS "ownerId",
                        A.has_open_report AS "hasOpenReport",
                        U.muted_at IS NOT NULL AS "isOwnerMuted",
                        TO_CHAR(U.muted_at + INTERVAL '15' DAY, 'dd-mm-yyyy') AS "ownerMutedUntil",
                        COALESCE(ARRAY_AGG(DISTINCT R.report_reason_id) filter (
                          WHERE R.report_reason_id IS NOT NULL
                          AND R.report_action_id IS NULL
                          AND R.updated_at IS NULL
                        ), '{}') AS "reportReasons"
                      FROM aspect A
                      JOIN "user" U
                        ON A.author_id = U.id
                      LEFT JOIN reported_item RI
                        ON A.id = RI.aspect_id
                      LEFT JOIN report R
                        ON RI.report_id = R.id
                      WHERE
                        A.id = $1
                        AND A.aspect_type_id = $2
                        AND A.deleted_at IS NULL
                      GROUP BY A.id, U.muted_at;`
  const { rows: [post] } = await pool.query(selectPost, [postId, ASPECT_TYPES.POST])
  return post
}

const getPostsByQuery = async ({ title, sort, order, category, page, limit, currUserId }) => {
  const selectPosts = `WITH counted_posts AS (
                        SELECT
                            *,
                            C.name AS category,
                            P.id AS counted_post_id,
                            COUNT(P.id) OVER() as total
                        FROM aspect P
                        LEFT JOIN category C ON P.category_id = C.id
                        LEFT JOIN vote V ON P.id = V.aspect_id AND V.user_id = $1
                        WHERE P.title ILIKE $2
                            AND P.deleted_at IS NULL
                            AND (P.category_id = $3 OR $3 IS NULL)
                          )
                          SELECT
                          CP.counted_post_id AS id,
                          CP.title,
                          CP.category_id AS "categoryId",
                          CP.category,
                          CP.slug,
                          CP.body,
                          CP.author_id AS "authorId",
                          COALESCE(CP.vote_direction, 0) AS "voteDirection",
                          CP.vote_count AS "voteCount",
                          CP.comment_count AS "commentCount",
                          CP.has_open_report AS "hasOpenReport",
                          CP.created_at AS "createdAt",
                          CP.updated_at AS "updatedAt",
                          CP.total::int
                        FROM counted_posts CP
                        ORDER BY ${sort} ${order}
                        LIMIT ${limit}
                        OFFSET ${(page - 1) * limit};`
  const { rows: searchResults } = await pool.query(selectPosts, [currUserId, title, category])
  const [results] = searchResults
  const posts = searchResults.map(row => {
    const { total, ...post } = row
    return post
  })

  return {
    total: results?.total || 0,
    page,
    limit,
    posts
  }
}

export { create, getById, getAll, updateById, deleteById, existsById, getPostsByQuery }
