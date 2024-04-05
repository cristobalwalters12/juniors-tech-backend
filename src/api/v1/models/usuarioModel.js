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
    role: user.role
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

const byEmailLogin = async ({ email }) => {
  const query = {
    text: `SELECT "user".id,"user".email,"user".username,"user".avatar_url, "user".password,"role".name
             FROM "user"
             JOIN user_role ON "user".id = user_role.user_id
             JOIN "role" ON user_role.role_id = "role".id
             WHERE "user".email = $1;`,
    values: [email]
  }
  const response = await pool.query(query)
  const user = response.rows[0]
  return {
    id: user.id,
    username: user.username,
    avatar_url: user.avatar_url,
    password: user.password,
    role: user.name
  }
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
  console.log(username)
  const Userquery = {
    text: `
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
      u.username = $1
    GROUP BY 
      u.id, p.name, c.id, itf.id;
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
const updateUser = async (id, fields) => {
  const userRes = await pool.query('SELECT * FROM "user" WHERE id = $1 AND deleted_at IS NULL AND muted_at IS NULL', [id])
  if (userRes.rowCount === 0) {
    throw new Error('User does not exist or is deleted or muted')
  }
  const userFields = ['open_to_work', 'about', 'employment_status_id', 'pronoun_id', 'avatar_url', 'country_id', 'it_field_id']
  const userValues = userFields.map(field => fields[field])
  const updateUserText = `UPDATE "user" SET (${userFields.join(', ')}) = ROW(${userValues.map((_, i) => `$${i + 2}`).join(', ')}) WHERE id = $1`
  await pool.query(updateUserText, [id, ...userValues])

  const relations = ['language', 'technology', 'education', 'social_network']
  const relationIdFields = {
    language: 'language_id',
    technology: 'technology_id',
    education: 'education_id',
    social_network: 'social_network_id'
  }
  for (const relation of relations) {
    const relationTable = `user_${relation}`
    const relationIdField = relationIdFields[relation]
    const deleteRelationText = `DELETE FROM "${relationTable}" WHERE user_id = $1`
    await pool.query(deleteRelationText, [id])
    if (Array.isArray(fields[relation])) {
      if (relation === 'social_network') {
        for (const relationId of fields[relation]) {
          const url = 'https://www.linkedin.com/in/'
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
export { createUser, getByEmail, byEmailLogin, validateEmailById, getUsers, getUserByUsername, updateUser }
