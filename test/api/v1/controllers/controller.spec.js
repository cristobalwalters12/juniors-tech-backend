import request from 'supertest'
import app from '../../../../src/api/v1/app'

describe('Testing routes', () => {
  describe('Categories', () => {
    test('GET /categories', async () => {
      const response = await request(app).get('/api/v1/categories')
      expect(response.status).toBe(200)
      expect(response.body).toHaveProperty('data')
    })
  })

  describe('Posts', () => {
    test('GET /posts', async () => {
      const response = await request(app).get('/api/v1/posts/')
      expect(response.status).toBe(200)
      expect(response.body).toBeInstanceOf(Object)
    })
  })

  describe('Users', () => {
    test('GET /users', async () => {
      const response = await request(app).get('/api/v1/users')
      expect(response.status).toBe(200)
    })

    test('GET -> obtengo un 200 si el usuario existe', async () => {
      const response = await request(app).get('/api/v1/users/Eliseo')
      expect(response.status).toBe(200)
      expect(response.body).toBeInstanceOf(Object)
    })

    test('GET -> obtengo un 404 si el usuario no existe', async () => {
      const response = await request(app).get('/api/v1/users/Maximiliano')
      expect(response.status).toBe(404)
      expect(response.body).toHaveProperty('error')
    })

    test('GET -> obtengo un 200 si tengo 3 usuarios en mi base de datos', async () => {
      const response = await request(app).get('/api/v1/users')
      expect(response.body.data.length).toBe(3)
    })
  })

  describe('Search', () => {
    test('GET -> Search', async () => {
      const response = await request(app).get('/api/v1/search')
      expect(response.status).toBe(200)
    })
  })

  describe('Comentarios', () => {
    test('GET -> Recibe 400 al hacer peticion a una id de una publicación que no existe', async () => {
      const response = await request(app).get('/api/v1/posts/123/comments')
      expect(response.status).toBe(400)
    })
  })
})
