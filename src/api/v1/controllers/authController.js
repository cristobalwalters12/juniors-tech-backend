import { byEmailLogin } from '../models/usuarioModel.js'
import { jwtAdapter, bcryptAdapter } from '../../../config/index.js'

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body
    const user = await byEmailLogin({ email })
    if (!user) {
      res.status(404).json({ message: 'User not found' })
    } else {
      const match = await bcryptAdapter.compare(password, user.password)
      if (match) {
        const accessToken = await jwtAdapter.generateAccessToken({ id: user.id, role: user.role })
        const tokenDecoded = jwtAdapter.decodeAccessToken(accessToken)
        res.status(200).json({
          status: 'success',
          message: 'Token is valid',
          data: {
            user,
            accessToken
          },
          tokenDecoded
        })
      } else {
        res.status(400).json({ message: 'Invalid password' })
      }
    }
  } catch (error) {
    res.status(500).json({ message: 'An error occurred', error: error.message })
  }
}

export { loginUser }
