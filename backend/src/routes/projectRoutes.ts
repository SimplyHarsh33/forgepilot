import { Router } from 'express'
import { listProjects, createProject, deleteProject, exportProjectZip } from '../controllers/projectController'

const router = Router()

router.get('/', listProjects)
router.post('/', createProject)
router.delete('/:name', deleteProject)
router.get('/:name/export', exportProjectZip)

export default router
