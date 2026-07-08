import express from 'express'
import cors from 'cors'
import { config } from './config/env'
import projectRoutes from './routes/projectRoutes'
import fileRoutes from './routes/fileRoutes'
import { listProjects, createProject } from './controllers/projectController'
import { readProjectFilesQuery, saveFileContent } from './controllers/fileController'
import { chatHandler } from './controllers/chatController'

const app = express()

// Middleware
app.use(cors())
app.use(express.json())

// Mount API routes (v1 prefix)
app.use('/api/projects', projectRoutes)
app.use('/api/projects', fileRoutes)

// Mount Root-level routes (requested custom endpoints)
app.get('/projects', listProjects)
app.post('/projects', createProject)
app.get('/files', readProjectFilesQuery)
app.post('/save', saveFileContent)
app.post('/chat', chatHandler)

// Default root route
app.get('/', (req, res) => {
  res.json({ message: 'ForgePilot Backend API is running successfully' })
})

// Start server
app.listen(config.PORT, () => {
  console.log(`[ForgePilot Backend] Server is listening on port ${config.PORT}`)
  console.log(`[ForgePilot Backend] Storage directory configured: ${config.PROJECTS_DIR}`)
})
