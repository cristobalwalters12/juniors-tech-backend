import { pool } from '../../../config/dbConnection.js'

const voteById = async ({ aspectId, authorId, voteId, voteDirection, currUserId }) => {
  const selectVote = `SELECT
                        id,
                        vote_direction AS "currVoteDirection"
                      FROM vote
                      WHERE
                        aspect_id = $1
                        AND user_id = $2;`
  const { rows: [vote] } = await pool.query(selectVote, [aspectId, currUserId])

  let voteValueUpdate = voteDirection
  if (vote === undefined) {
    const insertVote = `INSERT INTO vote
                          (id, vote_direction, aspect_id, user_id)
                        VALUES
                          ($1, $2, $3, $4);`
    await pool.query(insertVote, [voteId, voteDirection, aspectId, currUserId])
  } else {
    if (vote.currVoteDirection === voteDirection) {
      const deleteVote = 'DELETE FROM vote WHERE id = $1;'
      await pool.query(deleteVote, [vote.id])
      voteValueUpdate = -voteDirection
    } else {
      const reverseVote = 'UPDATE vote SET vote_direction = $1 WHERE id = $2;'
      await pool.query(reverseVote, [voteDirection, vote.id])
      voteValueUpdate = 2 * voteDirection
    }
  }
  const updateVoteCount = `UPDATE aspect
                          SET vote_count = vote_count + $1
                          WHERE id = $2;`

  const updateAuthorScore = `UPDATE "user"
                            SET score = score + $1
                            WHERE id = $2`
  Promise.all([
    await pool.query(updateVoteCount, [voteValueUpdate, aspectId]),
    await pool.query(updateAuthorScore, [voteValueUpdate, authorId])
  ])
}

export { voteById }
