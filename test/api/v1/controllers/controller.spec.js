import request from 'supertest'
import app from '../../../../src/api/v1/app'

describe('Testing routes', () => {
  test('GET /posts', async () => {
    const response = await request(app).get('/api/v1/posts/')
    expect(response.status).toBe(200)
  })

  test('GET /username', async () => {
    const response = await request(app).get('/api/v1/username')
    expect(response.statusCode).toBe(200)
  })

  test('GET /users', async () => {
    const response = await request(app).get('/api/v1/users')
    expect(response.status).toBe(200)
  })

  test('GET /users/:username', async () => {
    const response = await request(app).get('/api/v1/users/username_example')
    expect(response.status).toBe(200)
  })

  test('PUT /users/:id', async () => {
    const response = await request(app).put('/api/v1/users/user_id').send({
      openToWork: true,
      about: 'About me',
      employmentStatusId: 'status_id',
      pronoun: 'He/Him',
      avatarUrl: 'example.com/avatar',
      countryId: 'country_id',
      languages: ['lang_id1', 'lang_id2'],
      itFieldId: 'it_field_id',
      technologies: ['tech_id1', 'tech_id2'],
      education: ['edu_id1', 'edu_id2'],
      social_networks: ['url1', 'url2']
    })
    expect(response.status).toBe(200)
  })

  test('GET /posts/:id', async () => {
    const response = await request(app).get('/api/v1/posts/post_id')
    expect(response.status).toBe(200)
  })

  test('PUT /posts/:id', async () => {
    const response = await request(app).put('/api/v1/posts/post_id').send({
      title: 'New Title',
      body: 'New Body',
      categoryId: 'category_id'
    })
    expect(response.statusCode).toBe(200)
  })

  test('GET /posts/:id/comments', async () => {
    const response = await request(app).get('/api/v1/posts/post_id/comments')
    expect(response.status).toBe(200)
  })

  test('GET /reports?type=reportTypeId', async () => {
    const response = await request(app).get('/api/v1/reports?type=report_type_id')
    expect(response.status).toBe(200)
  })

  test('GET /categories', async () => {
    const response = await request(app).get('/api/v1/categories')
    expect(response.status).toBe(200)
  })

  test('PUT /categories/:id', async () => {
    const response = await request(app).put('/api/v1/categories/category_id').send({
      name: 'New Category Name'
    })
    expect(response.status).toBe(200)
  })

  test('GET /mods', async () => {
    const response = await request(app).get('/api/v1/mods')
    expect(response.status).toBe(200)
  })
})
