import { REPORT_TYPES, pool } from '../../../config/index.js'

const getPostReports = async () => {
  const selectReports = `SELECT
                          R.id AS "reportId",
                          P.id AS "postId",
                          P.title AS "postTitle",
                          PA.username AS "postAuthorUsername",
                          P.author_id AS "postAuthorId",
                          R.reported_by AS "reportedBy",
                          RA.username AS "reportByUsername",
                          R.report_reason_id AS "reportReasonId",
                          R.report_action_id AS "reportActionId",
                          R.created_at AS "createdAt",
                          R.updated_at AS "updatedAt"
                        FROM "user" RA
                        LEFT JOIN report R
                        ON RA.id = R.reported_by
                        LEFT JOIN reported_item RI
                        ON R.id = RI.report_id
                        LEFT JOIN aspect P
                        ON RI.aspect_id = P.id
                        LEFT JOIN "user" PA
                        ON P.author_id = PA.id
                        WHERE
                        R.report_type_id = $1;`
  const { rows: reports } = await pool.query(selectReports, [REPORT_TYPES.POST])
  return reports
}

const getCommentReports = async () => {
  const selectReports = `SELECT
                          R.id AS "reportId",
                          C.post_id AS "postId",
                          C.id AS "commentId",
                          C.body AS "commentBody",
                          CA.username AS "commentAuthorUsername",
                          C.author_id AS "commentAuthorId",
                          R.reported_by AS "reportedBy",
                          RA.username AS "reportByUsername",
                          R.report_reason_id AS "reportReasonId",
                          R.report_action_id AS "reportActionId",
                          R.created_at AS "createdAt",
                          R.updated_at AS "updatedAt"
                        FROM "user" RA
                        LEFT JOIN report R
                        ON RA.id = R.reported_by
                        LEFT JOIN reported_item RI
                        ON R.id = RI.report_id
                        LEFT JOIN aspect C
                        ON RI.aspect_id = C.id
                        LEFT JOIN "user" CA
                        ON C.author_id = CA.id
                        WHERE
                        R.report_type_id = $1;`
  const { rows: reports } = await pool.query(selectReports, [REPORT_TYPES.COMMENT])
  return reports
}

const getUserReports = async () => {
  const selectReports = `SELECT
                          R.id AS "reportId",
                          U.username AS "reportedUser",
                          R.reported_by AS "reportedBy",
                          RA.username AS "reportByUsername",
                          R.report_reason_id AS "reportReasonId",
                          R.report_action_id AS "reportActionId",
                          R.created_at AS "createdAt",
                          R.updated_at AS "updatedAt"
                        FROM "user" RA
                        LEFT JOIN report R
                        ON RA.id = R.reported_by
                        LEFT JOIN reported_item RI
                        ON R.id = RI.report_id
                        LEFT JOIN "user" U
                        ON RI.user_id = U.id
                        WHERE
                        R.report_type_id = $1;`
  const { rows: reports } = await pool.query(selectReports, [REPORT_TYPES.USER])
  return reports
}

export { getPostReports, getCommentReports, getUserReports }
