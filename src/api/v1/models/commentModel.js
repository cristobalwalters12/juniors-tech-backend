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
                            A.id,
                            A.post_id AS "postId",
                            A.parent_id AS "parentId",
                            A.body,
                            A.author_id AS "authorId",
                            U.username AS "authorUsername",
                            U.avatar_url AS "avatarUrl",
                            A.vote_count AS "voteCount",
                            A.comment_count AS "commentCount",
                            A.created_at AS "createdAt",
                            A.updated_at AS "updatedAt",
                            A.deleted_at IS NOT NULL AS "commentDeleted",
                            A.deleted_at AS "deletedAt",
                            A.has_open_report AS "hasOpenReport",
                            U.deleted_at IS NOT NULL AS "authorDeleted"
                          FROM aspect A
                          JOIN "user" U
                          ON A.author_id = U.id
                          WHERE post_id = $1;`
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

const parentCommentExist = async (parentId) => {
  const selectParentComment = `SELECT
                                deleted_at IS NULL AS "exists"
                              FROM aspect
                              WHERE id = $1;`
  const { rows: [parentComment] } = await pool.query(selectParentComment, [parentId])

  return parentComment
}

export { create, getAll, updateById, parentCommentExist }
