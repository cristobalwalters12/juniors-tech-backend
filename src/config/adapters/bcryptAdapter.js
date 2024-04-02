import bcrypt from 'bcrypt'

const bcryptAdapter = {
  hash: async (password) => {
    const saltRounds = 10
    return await bcrypt.hash(password, saltRounds)
  },
  compare: async (plainPassword, hashedPassword) =>
    await bcrypt.compare(plainPassword, hashedPassword)
}

export { bcryptAdapter }
