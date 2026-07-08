import dotenv from 'dotenv'
import path from 'path'

dotenv.config({ path: path.join(__dirname, '../../.env') })

export const config = {
  PORT: process.env.PORT || 5000,
  PROJECTS_DIR: process.env.PROJECTS_DIR || path.join(process.cwd(), 'workspaces'),
  GEMINI_API_KEY: process.env.GEMINI_API_KEY || '',
}
