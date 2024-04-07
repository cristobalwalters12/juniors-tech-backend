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
  const { rows: reports } = await pool.query(selectReports, [REPORT_TYPES.POST.id])
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
  const { rows: reports } = await pool.query(selectReports, [REPORT_TYPES.COMMENT.id])
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
  const { rows: reports } = await pool.query(selectReports, [REPORT_TYPES.USER.id])
  return reports
}

const createReport = async ({
  reportId,
  reportedBy,
  reportedItemId,
  reportType,
  reportRelationshipId,
  reportReasonId
}) => {
  const insertReport = `WITH R AS (
                          INSERT INTO report
                            (id, reported_by, report_type_id, report_reason_id)
                          VALUES ($1, $2, $3, $4)
                          RETURNING created_at, reported_by
                        )
                        SELECT
                          R.created_at AS "createdAt",
                          U.username AS "reportedBy"
                        FROM R
                        JOIN "user" U
                        ON R.reported_by = U.id;`

  const insertReportRelationship = `INSERT INTO reported_item
                                      (id, report_id, ${reportType.column})
                                    VALUES ($1, $2, $3)`

  const updateReportedResource = `UPDATE "${reportType.table}"
                                  SET has_open_report = TRUE
                                  WHERE id = $1;`

  const [{ rows: [report] }] = await Promise.all([
    pool.query(insertReport, [reportId, reportedBy, reportType.id, reportReasonId]),
    pool.query(insertReportRelationship, [reportRelationshipId, reportId, reportedItemId]),
    pool.query(updateReportedResource, [reportedItemId])
  ])

  return {
    reportId,
    reportedBy: report.reportedBy,
    reportedItemId,
    reportReasonId,
    createdAt: report.createdAt
  }
}

export { getPostReports, getCommentReports, getUserReports, createReport }
