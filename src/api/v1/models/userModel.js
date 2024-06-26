import { pool } from '../../../config/dbConnection.js'
import { bcryptAdapter } from '../../../config/index.js'
import { getUUID } from '../../../config/adapters/uuidAdapter.js'

const createUser = async ({ email, password, username, birthdate }) => {
  const hashedPassword = await bcryptAdapter.hash(password, 10)
  const id = getUUID()
  const insertUserText = 'INSERT INTO "user" (id,email, password, username, birthdate) VALUES ($1, $2, $3, $4, $5) RETURNING *'
  const insertUserValues = [id, email, hashedPassword, username, birthdate]
  const userRes = await pool.query(insertUserText, insertUserValues)
  const userId = userRes.rows[0].id
  const insertUserRoleText = 'INSERT INTO user_role (user_id, role_id) SELECT $1, id FROM role WHERE name = \'usuario\''
  const insertUserRoleValues = [userId]
  await pool.query(insertUserRoleText, insertUserRoleValues)

  const getUserRoleText = 'SELECT role.name FROM role JOIN user_role ON role.id = user_role.role_id WHERE user_role.user_id = $1'
  const getUserRoleValues = [userId]
  const roleRes = await pool.query(getUserRoleText, getUserRoleValues)
  const role = roleRes.rows[0].name
  const user = userRes.rows[0]
  user.role = role
  return {
    id: user.id,
    email: user.email,
    username: user.username,
    birthdate: user.birthdate,
    role: [user.role]
  }
}

const getByEmail = async ({ email }) => {
  const query = {
    text: 'SELECT * FROM "user" WHERE email = $1',
    values: [email]
  }
  const response = await pool.query(query)
  return response.rows[0]
}

const byEmailLogin = async (email) => {
  const query = {
    text: `SELECT
            U.id,
            U.username,
            U.avatar_url AS "avatarUrl",
            U.password,
            ARRAY_AGG(DISTINCT R.name) AS roles,
            U.muted_at AS "mutedAt",
            EXTRACT(day from CURRENT_DATE - U.updated_at) AS "totalDaysMuted",
            U.deleted_at IS NOT NULL AS "deleted"
          FROM "user" U
          JOIN user_role UR ON U.id = UR.user_id
          JOIN "role" R ON UR.role_id = R.id
          WHERE U.email = $1
          GROUP BY U.id;`,
    values: [email]
  }
  const { rows: [user] } = await pool.query(query)
  if (user?.totalDaysMuted >= 15) {
    const unmuteUser = 'UPDATE "user" SET muted_at = NULL WHERE U.id = $1'
    await pool.query(unmuteUser, user.id)
  }
  return user
}

const getUsers = async (page, size) => {
  const offset = (page - 1) * size
  const getUsersQuery = {
    text: 'SELECT "id", "username", "avatar_url", "country_id", "score", "it_field_id", "open_to_work" FROM "user" WHERE "muted_at" IS NULL AND "deleted_at" IS NULL ORDER BY "score" DESC LIMIT $1 OFFSET $2',
    values: [size, offset]
  }
  const usersRes = await pool.query(getUsersQuery)
  const users = usersRes.rows

  for (const user of users) {
    const getLanguagesQuery = {
      text: 'SELECT "language_id" FROM "user_language" WHERE "user_id" = $1',
      values: [user.id]
    }
    const languagesRes = await pool.query(getLanguagesQuery)
    user.languages = languagesRes.rows.map(row => row.language_id)

    const getTechnologiesQuery = {
      text: 'SELECT "technology_id" FROM "user_technology" WHERE "user_id" = $1',
      values: [user.id]
    }
    const technologiesRes = await pool.query(getTechnologiesQuery)
    user.technologies = technologiesRes.rows.map(row => row.technology_id)
  }

  const countUsersQuery = {
    text: 'SELECT COUNT(*) FROM "user" WHERE "muted_at" IS NULL AND "deleted_at" IS NULL'
  }
  const countRes = await pool.query(countUsersQuery)
  const totalUsers = parseInt(countRes.rows[0].count)
  const totalPages = Math.ceil(totalUsers / size)

  return {
    data: users,
    size,
    page,
    prev: page > 1 ? page - 1 : null,
    next: page < totalPages ? page + 1 : null
  }
}

const getUserByUsername = async (username) => {
  const Userquery = {
    text: `
    SELECT 
    u.id,
    u.username,
    u.score,
    u.post_count as "postCount",
    u.comment_count as "commentCount",
    u.open_to_work as "openToWork",
    u.about,
    es."name" as "employmentStatus",
  es.id as "employmenStatusId",
    p.name AS pronoun, 
    u.avatar_url as "avatarUrl",
    u.created_at as "createdAt",
    u.muted_at as "mutedAt",
    u.deleted_at as "deletedAt",
    c."name" AS "country", 
    c."id" as "countryId",
    itf."name" AS "itField",
    itf.id as "itFieldId",
    ARRAY_AGG(DISTINCT len."name") AS languages,
    ARRAY_AGG(DISTINCT ul.language_id) AS "languagesId", 
    ARRAY_AGG(DISTINCT t."name") AS technologies, 
    ARRAY_AGG(DISTINCT ut.technology_id) AS "technologiesId", 
    ARRAY_AGG(DISTINCT e."name") AS education,
    ARRAY_AGG(DISTINCT ue.education_id) AS educationId,
    ARRAY_AGG(DISTINCT usn.url) AS social_networks, 
    ARRAY_AGG(DISTINCT ur.role_id) AS roles
    FROM 
      "user" u 
    LEFT JOIN 
      "pronoun" p ON u.pronoun_id = p.id 
    LEFT JOIN 
      "country" c ON u.country_id = c.id 
    LEFT JOIN
      "employment_status" es on u.employment_status_id = es.id
    LEFT JOIN 
      "user_language" ul ON u.id = ul.user_id 
    LEFT JOIN
      "language" len on ul.language_id = len.id
    LEFT JOIN 
      "it_field" itf ON u.it_field_id = itf.id
    LEFT JOIN 
      "user_technology" ut ON u.id = ut.user_id 
    LEFT JOIN
      "technology" t ON ut.technology_id = t.id
    LEFT JOIN 
      "user_education" ue ON u.id = ue.user_id 
    LEFT JOIN
    "education" e on ue.education_id =e.id
    LEFT JOIN 
      "user_social_network" usn ON u.id = usn.user_id 
    LEFT JOIN 
      "user_role" ur ON u.id = ur.user_id 
    WHERE 
      u.username = $1
    GROUP BY 
      u.id, p.name, c.id, itf.id, es."name", es.id
      `,
    values: [username]
  }

  const response = await pool.query(Userquery)
  const user = response.rows[0]

  if (user) {
    if (user.mutedAt) {
      user.isMuted = true
    }
    if (user.deletedAt) {
      user.isDeleted = true
    }
  }
  if (!user) {
    return null
  }
  return user
}

const validateEmailById = async (id) => {
  const query = {
    text: 'SELECT * FROM "user" WHERE id = $1',
    values: [id]
  }
  const response = await pool.query(query)
  const user = response.rows[0]

  if (!user) {
    throw new Error('El usuario no existe')
  } else if (user.muted_at) {
    throw new Error('El usuario ha sido silenciado')
  } else if (user.deleted_at) {
    throw new Error('El usuario ha sido eliminado')
  }

  return user
}

const toSnakeCase = (str) => str.replace(/[A-Z]/g, letter => `_${letter.toLowerCase()}`)

const convertKeysToSnakeCase = (obj) => {
  const newObj = {}
  for (const key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      const newKey = toSnakeCase(key)
      newObj[newKey] = obj[key]
    }
  }
  return newObj
}
const updateUser = async (id, fields) => {
  fields = convertKeysToSnakeCase(fields)
  const userRes = await pool.query('SELECT * FROM "user" WHERE id = $1 AND deleted_at IS NULL AND muted_at IS NULL', [id])
  if (userRes.rowCount === 0) {
    throw new Error('User does not exist or is deleted or muted')
  }
  const userFields = ['open_to_work', 'about', 'employment_status_id', 'pronoun_id', 'avatar_url', 'country_id', 'it_field_id']
  const providedFields = userFields.filter(field => fields[field] !== undefined)
  const userValues = providedFields.map(field => fields[field])
  if (providedFields.length > 0) {
    const updateUserText = `UPDATE "user" SET (${providedFields.join(', ')}) = ROW(${userValues.map((_, i) => `$${i + 2}`).join(', ')}) WHERE id = $1`
    await pool.query(updateUserText, [id, ...userValues])
  }

  const relations = ['language', 'technology', 'education', 'social_network']
  const relationIdFields = {
    language: 'language_id',
    technology: 'technology_id',
    education: 'education_id',
    social_network: 'social_network_id'
  }
  for (const relation of relations) {
    if (Array.isArray(fields[relation])) {
      const relationTable = `user_${relation}`
      const relationIdField = relationIdFields[relation]
      const deleteRelationText = `DELETE FROM "${relationTable}" WHERE user_id = $1`
      await pool.query(deleteRelationText, [id])
      if (relation === 'social_network') {
        for (const socialNetwork of fields[relation]) {
          const url = socialNetwork.url
          const relationId = socialNetwork.id
          const insertRelationText = `INSERT INTO "${relationTable}" (user_id, ${relationIdField}, url) VALUES ($1, $2, $3)`
          await pool.query(insertRelationText, [id, relationId, url])
        }
      } else {
        for (const relationId of fields[relation]) {
          const insertRelationText = `INSERT INTO "${relationTable}" (user_id, ${relationIdField}) VALUES ($1, $2)`
          await pool.query(insertRelationText, [id, relationId])
        }
      }
    }
  }
  const updatedUserRes = await pool.query(`
  SELECT 
  u.id,
  u.username,
  u.score,
  u.post_count,
  u.open_to_work as "openToWork",
  u.about,
  u.employment_status_id as "employmentStatusId",
  p.name AS pronoun, 
  u.avatar_url as "avatarUrl",
  u.created_at as "createdAt",
  u.muted_at as "mutedAt",
  u.deleted_at as "deletedAt",
  c.id AS "countryId", 
  ARRAY_AGG(DISTINCT ul.language_id) AS languages, 
  itf.id AS "itField", 
  ARRAY_AGG(DISTINCT ut.technology_id) AS technologies, 
  ARRAY_AGG(DISTINCT ue.education_id) AS education, 
  ARRAY_AGG(DISTINCT usn.url) AS social_networks, 
  ARRAY_AGG(DISTINCT ur.role_id) AS roles
  FROM 
    "user" u 
  LEFT JOIN 
    "pronoun" p ON u.pronoun_id = p.id 
  LEFT JOIN 
    "country" c ON u.country_id = c.id 
  LEFT JOIN 
    "user_language" ul ON u.id = ul.user_id 
  LEFT JOIN 
    "it_field" itf ON u.it_field_id = itf.id 
  LEFT JOIN 
    "user_technology" ut ON u.id = ut.user_id 
  LEFT JOIN 
    "user_education" ue ON u.id = ue.user_id 
  LEFT JOIN 
    "user_social_network" usn ON u.id = usn.user_id 
  LEFT JOIN 
    "user_role" ur ON u.id = ur.user_id 
  WHERE 
    u.id = $1
  GROUP BY 
    u.id, p.name, c.id, itf.id;
    `, [id])
  return updatedUserRes.rows[0]
}

const getUserAuthDataIfExists = async (username) => {
  const selectUser = `SELECT
                        U.id,
                        U.id AS "ownerId",
                        U.has_open_report AS "hasOpenReport",
                        ARRAY_AGG(DISTINCT R.name) AS roles,
                        U.muted_at IS NOT NULL AS "isOwnerMuted",
                        TO_CHAR(U.muted_at + INTERVAL '15' DAY, 'dd-mm-yyyy') AS "ownerMutedUntil",
                        COALESCE(ARRAY_AGG(DISTINCT RE.report_reason_id)
                          FILTER (WHERE RE.report_reason_id IS NOT NULL
                            AND RE.report_action_id IS NULL
                            AND RE.updated_at IS NULL), '{}'
                          ) AS "reportReasons"
                      FROM "user" U
                      JOIN user_role UR
                        ON U.id = UR.user_id
                      JOIN role R
                        ON UR.role_id = R.id
                      LEFT JOIN reported_item RI
                        ON U.id = RI.user_id
                      LEFT JOIN report RE
                        ON RI.report_id = RE.id
                      WHERE U.username = $1
                        AND U.deleted_at IS NULL
                      GROUP BY U.id;`
  const { rows: [user] } = await pool.query(selectUser, [username])
  return user
}

const desactivateUser = async (id) => {
  const query = {
    text: 'UPDATE "user" SET deleted_at = CURRENT_TIMESTAMP WHERE id = $1',
    values: [id]
  }
  const response = await pool.query(query)
  return response.rows[0]
}

const isAccountOwnerMuted = async (userId) => {
  const selectAccount = `SELECT
                          muted_at IS NOT NULL AS "isOwnerMuted",
                          TO_CHAR(muted_at + INTERVAL '15' DAY, 'dd-mm-yyyy') AS "ownerMutedUntil"
                        FROM "user"
                        WHERE id = $1;`
  const { rows: [account] } = await pool.query(selectAccount, [userId])
  if (account && account.isOwnerMuted) {
    return account
  }
  return {
    isOwnerMuted: false,
    ownerMutedUntil: null
  }
}

const getUsersByQuery = async ({ q, sort, order, page, limit, country, otw, it, lang, tech }) => {
  let selectUsers = `WITH counted_users AS (
                        SELECT
                          U.id,
                          U.username,
                          U.avatar_url AS "avatarUrl",
                          U.score,
                          U.open_to_work AS "openToWork",
                          U.country_id AS "countryId",
                          U.it_field_id AS "itFieldId",
                          COALESCE(ARRAY_AGG(DISTINCT UL.language_id)
                            FILTER (WHERE UL.language_id IS NOT NULL), '{}'
                          ) AS "languages",
                          COALESCE(ARRAY_AGG(DISTINCT UT.technology_id)
                            FILTER (WHERE UT.technology_id IS NOT NULL), '{}'
                          ) AS "technologies",
                          COUNT(U.id) OVER() as total
                        FROM "user" U
                        LEFT JOIN user_language UL
                          ON U.id = UL.user_id
                        LEFT JOIN user_technology UT
                          ON U.id = UT.user_id
                        WHERE U.username ILIKE $1
                          AND U.deleted_at IS NULL `
  let paramNumber = 2
  const params = [q]
  if (country !== undefined) {
    selectUsers += ` AND U.country_id = $${paramNumber++}`
    params.push(country)
  }
  if (otw !== undefined) {
    selectUsers += ` AND U.open_to_work = $${paramNumber++}`
    params.push(otw)
  }
  if (it !== undefined) {
    selectUsers += ` AND U.it_field_id = $${paramNumber++}`
    params.push(it)
  }
  if (lang?.length > 0) {
    const paramNumbers = lang.map(() => paramNumber++).join(', $')
    selectUsers += ` AND UL.language_id IN ($${paramNumbers})`
    params.push(...lang)
  }
  if (tech?.length > 0) {
    const paramNumbers = tech.map(() => paramNumber++).join(', ')
    selectUsers += ` AND UT.technology_id IN ($${paramNumbers})`
    params.push(...tech)
  }
  selectUsers += ` GROUP BY U.id)
                  SELECT
                  *,
                  CU.total::int
                FROM counted_users CU
                ORDER BY ${sort} ${order}
                LIMIT ${limit}
                OFFSET ${(page - 1) * limit};`
  const { rows: searchResults } = await pool.query(selectUsers, params)
  const total = searchResults?.[0]?.total || 0
  const users = searchResults.map(row => {
    const { total, ...user } = row
    return user
  })
  return {
    total,
    page,
    limit,
    users
  }
}

const changePassword = async (id, password) => {
  const hashedPassword = await bcryptAdapter.hash(password, 10)
  const query = {
    text: 'UPDATE "user" SET password = $1, updated_at = NOW() WHERE id = $2',
    values: [hashedPassword, id]
  }
  await pool.query(query)
}

export {
  createUser,
  getByEmail,
  byEmailLogin,
  validateEmailById,
  getUsers,
  getUsersByQuery,
  getUserByUsername,
  updateUser,
  getUserAuthDataIfExists,
  desactivateUser,
  isAccountOwnerMuted,
  changePassword
}
