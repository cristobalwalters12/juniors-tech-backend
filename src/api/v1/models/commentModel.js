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
  const { rows: [commentData] } = await pool.query(insertComment, [id, ASPECT_TYPES.COMMENT, postId, parentId, body, currUserId])

  const updateAuthor = `UPDATE "user"
                        SET comment_count = comment_count + 1
                        WHERE id = $1
                        RETURNING
                          username AS "authorUsername",
                          avatar_url AS "avatarUrl";`

  const updateAncestors = `UPDATE aspect
                        SET comment_count = comment_count + 1
                        WHERE id IN ($1, $2);`

  const [{ rows: [author] }] = await Promise.all([
    pool.query(updateAuthor, [currUserId]),
    pool.query(updateAncestors, [postId, parentId])
  ])

  return { ...commentData, ...author, voteDirection: 0 }
}

const getAll = async ({ postId, currUserId }) => {
  const selectComments = `SELECT
                            C.id,
                            C.post_id AS "postId",
                            C.parent_id AS "parentId",
                            C.body,
                            C.author_id AS "authorId",
                            U.username AS "authorUsername",
                            U.avatar_url AS "avatarUrl",
                            C.vote_count AS "voteCount",
                            C.comment_count AS "commentCount",
                            C.created_at AS "createdAt",
                            C.updated_at AS "updatedAt",
                            C.deleted_at IS NOT NULL AS "commentDeleted",
                            C.deleted_at AS "deletedAt",
                            C.has_open_report AS "hasOpenReport",
                            U.deleted_at IS NOT NULL AS "authorDeleted"
                          FROM aspect C
                          JOIN "user" U
                            ON C.author_id = U.id
                          WHERE post_id = $1
                          ORDER BY C.created_at DESC;`
  const { rows: rawCommentsData } = await pool.query(selectComments, [postId])
  const commentsVotes = {}

  if (currUserId !== undefined) {
    const selectCommentVotes = `SELECT
                                  V.vote_direction AS "voteDirection",
                                  V.aspect_id AS "commentId"
                                FROM aspect A
                                JOIN vote V
                                ON A.id = V.aspect_id
                                WHERE A.post_id = $1
                                AND V.user_id = $2;`
    const { rows: rawCommentsVotes } = await pool.query(selectCommentVotes, [postId, currUserId])

    rawCommentsVotes.forEach(({ voteDirection, commentId }) => {
      commentsVotes[commentId] = voteDirection
    })
  }

  const visibleCommentsData = rawCommentsData.map(rawComment => {
    if (!rawComment.authorDeleted && !rawComment.commentDeleted) {
      rawComment.voteDirection = commentsVotes[rawComment.id] || 0
    } else {
      rawComment.authorId = null
      rawComment.authorUsername = null
      rawComment.avatarUrl = null
      rawComment.voteDirection = 0
      if (rawComment.commentDeleted) {
        rawComment.body = 'Comentario eliminado'
        rawComment.voteCount = null
      }
    }
    const { authorDeleted, commentDeleted, ...comment } = rawComment
    return comment
  })

  return visibleCommentsData
}

const updateById = async ({ commentId, body, currUserId }) => {
  const updateComment = `UPDATE aspect
                        SET
                          body = $1,
                          updated_at = NOW()
                        WHERE id = $2
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
  const { rows: [comment] } = await pool.query(updateComment, [body, commentId])

  const selectAuthor = `SELECT
                          username AS "authorUsername",
                          avatar_url AS "avatarUrl"
                        FROM "user"
                        WHERE id = $1;`
  const { rows: [author] } = await pool.query(selectAuthor, [currUserId])

  const selectVoteDirection = `SELECT
                                V.vote_direction AS "voteDirection"
                              FROM vote V
                              WHERE V.user_id = $1
                              AND V.aspect_id = $2;`
  const { rows: [vote] } = await pool.query(selectVoteDirection, [currUserId, commentId])
  comment.voteDirection = vote?.voteDirection || 0

  return { ...comment, ...author }
}

const deleteById = async (commentId) => {
  const deleteComment = `UPDATE aspect
                          SET deleted_at = NOW()
                          WHERE id = $1
                          RETURNING author_id AS "authorId";`

  const { rows: [author] } = await pool.query(deleteComment, [commentId])

  const updateAuthor = `UPDATE "user"
                        SET comment_count = comment_count - 1
                        WHERE id = $1;`
  await pool.query(updateAuthor, [author.authorId])
}

const existsById = async (commentId) => {
  const selectExists = `SELECT EXISTS(
                                SELECT 1 FROM aspect
                                WHERE id = $1
                                AND deleted_at IS NULL);`
  const { rows: [comment] } = await pool.query(selectExists, [commentId])

  return comment.exists
}

const getAuthDataIfExists = async ({ postId, commentId }) => {
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
                        AND A.post_id = $3
                        AND A.deleted_at IS NULL
                      GROUP BY A.id, U.muted_at;`
  const { rows: [comment] } = await pool.query(selectPost, [commentId, ASPECT_TYPES.COMMENT, postId])
  return comment
}

export { create, getAll, updateById, deleteById, existsById, getAuthDataIfExists }
