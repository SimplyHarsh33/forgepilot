import dotenv from 'dotenv'
import path from 'path'

dotenv.config({ path: path.join(__dirname, '../../.env') })

export const config = {
  PORT: process.env.PORT || '5000',
  PROJECTS_DIR: path.resolve(process.env.PROJECTS_DIR || './workspaces'),
}
