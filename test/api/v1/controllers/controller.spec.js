/* // fuente: https://github.com/FabianPinoP/swagger-tutorial
import request from 'supertest'
import { generateToken } from '../../../utils/login.js'
import app from '../../../../src/api/v1/app.js'

describe('travels controller', () => {
  describe('GET /api/v1/travels with valid params', () => {
    const token = generateToken()
    it('should return all travels', async () => {
      const response = await request(app)
        .get('/api/v1/travels')
        .set('Authorization', `Bearer ${token}`)
      expect(response.statusCode).toBe(200)
    })
  })
})
 */

const sumar = (a, b) => a + b
describe('Testing unitario con Jest', () => {
  it('Comprobando el resultado de una sumatoria', () => {
    const n1 = 4
    const n2 = 5
    const resultado = sumar(n1, n2)
    expect(resultado).toBe(9)
  })
})
