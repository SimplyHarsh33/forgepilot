import { Router } from 'express'
import { 
  readProjectFiles, createFileOrFolder, updateFileContent, deleteFileOrFolder, renameFileOrFolder 
} from '../controllers/fileController'

const router = Router()

router.get('/:name/files', readProjectFiles)
router.post('/:name/files', createFileOrFolder)
router.put('/:name/files', updateFileContent)
router.delete('/:name/files', deleteFileOrFolder)
router.post('/:name/files/rename', renameFileOrFolder)

export default router
