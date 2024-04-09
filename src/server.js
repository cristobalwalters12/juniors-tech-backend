import { PORT } from './config/index.js'

import app from './api/v1/app.js'

process.on('uncaughtException', (error) => {
  console.log(`Uncaught Exception: ${error.name}\n ${error.message}`)
  process.exit(1)
})

const server = app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`)
  console.log(`Api documentation on http://localhost:${PORT}/api/v1/docs`)
})

process.on('unhandledRejection', (error) => {
  console.log(`Unhandled Exception: ${error.name}\n ${error.message}`)
  server.close(() => process.exit(1))
})
