import jwt from 'jsonwebtoken'

const generateToken = () => {
  const email = 'ejemplo@correo.com'
  return jwt.sign({ email }, process.env.JWT_SECRET, {
    expiresIn: '1h'
  })
}

export { generateToken }
