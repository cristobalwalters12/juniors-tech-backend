import request from 'supertest'
import app from '../../../../src/api/v1/app'

describe('Testing routes', () => {
  test('GET /categories', async () => {
    const response = await request(app).get('/api/v1/categories')
    expect(response.status).toBe(200)
  })

  test('GET /posts', async () => {
    const response = await request(app).get('/api/v1/posts/')
    expect(response.status).toBe(200)
  })

  test('DELETE /posts/:id devuelve status 400 cuando se intenta eliminar una publicación con id invalido', async () => {
    const postId = '5'
    const response = await request(app)
      .delete(`/api/v1/posts/${postId}`)
    expect(response.status).toBe(400)
  })

  test('DELETE /posts/:id devuelve status 404 cuando se intenta eliminar una publicación que no existe', async () => {
    const postId = 'Keevwx9Hb0'
    const response = await request(app)
      .delete(`/api/v1/posts/${postId}`)
    expect(response.status).toBe(404)
  })

  test('GET /users', async () => {
    const response = await request(app).get('/api/v1/usuarios')
    expect(response.status).toBe(200)
  })
})
