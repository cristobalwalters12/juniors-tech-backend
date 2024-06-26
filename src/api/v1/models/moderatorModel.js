import { ROLE_TYPES } from '../../../config/index.js'
import { pool } from '../../../config/dbConnection.js'

const getAll = async () => {
  const selectMods = `SELECT
                        U.id,
                        U.username
                      FROM "user" U
                      JOIN user_role UR
                      ON U.id = UR.user_id
                      WHERE UR.role_id = $1
                      AND U.deleted_at IS NULL;`
  const { rows: mods } = await pool.query(selectMods, [ROLE_TYPES.MOD.id])
  return mods
}

const promoteToMod = async (userId) => {
  const updateUserRole = `INSERT INTO user_role
                          (user_id, role_id)
                          VALUES ($1, $2);`
  await pool.query(updateUserRole, [userId, ROLE_TYPES.MOD.id])
}

const demote = async (userId) => {
  const updateUserRole = 'DELETE FROM user_role WHERE user_id = $1 AND role_id = $2;'
  await pool.query(updateUserRole, [userId, ROLE_TYPES.MOD.id])
}

const mute = async (userId) => {
  const muteUser = 'UPDATE "user" SET muted_at = NOW() WHERE id = $1'
  await pool.query(muteUser, [userId])
}

export { getAll, promoteToMod, mute, demote }
