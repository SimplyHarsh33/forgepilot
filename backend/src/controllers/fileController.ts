import { Request, Response } from 'express'
import fs from 'fs/promises'
import path from 'path'
import { config } from '../config/env'
import { WorkspaceFile } from '../models/projectModel'

// Helper to ensure target directory exists
async function ensureDir(dirPath: string) {
  try {
    await fs.mkdir(dirPath, { recursive: true })
  } catch (err: any) {
    if (err.code !== 'EEXIST') throw err
  }
}

// Helper to recursively collect files
async function scanDir(projPath: string, currentDir: string, result: { [filePath: string]: WorkspaceFile }) {
  const absolutePath = path.join(projPath, currentDir)
  const items = await fs.readdir(absolutePath, { withFileTypes: true })

  for (const item of items) {
    // Relative path of the item from project root
    const relPath = currentDir ? `${currentDir}/${item.name}` : item.name
    
    // Ignore hidden files / directories (like .metadata.json, .git, etc.)
    if (item.name.startsWith('.')) continue

    if (item.isDirectory()) {
      result[relPath] = {
        path: relPath,
        name: item.name,
        content: '',
        isFolder: true
      }
      await scanDir(projPath, relPath, result)
    } else if (item.isFile()) {
      const fileContent = await fs.readFile(path.join(projPath, relPath), 'utf-8')
      result[relPath] = {
        path: relPath,
        name: item.name,
        content: fileContent,
        isFolder: false
      }
    }
  }
}

export const readProjectFiles = async (req: Request, res: Response) => {
  try {
    const { name } = req.params
    const projPath = path.join(config.PROJECTS_DIR, name)

    // Verify project folder exists
    try {
      await fs.access(projPath)
    } catch {
      return res.status(404).json({ error: `Project '${name}' not found` })
    }

    const filesDict: { [filePath: string]: WorkspaceFile } = {}
    await scanDir(projPath, '', filesDict)

    res.status(200).json(filesDict)
  } catch (err: any) {
    res.status(500).json({ error: `Failed to read project files: ${err.message}` })
  }
}

export const createFileOrFolder = async (req: Request, res: Response) => {
  try {
    const { name } = req.params
    const { path: relPath, content, isFolder } = req.body

    if (!relPath) {
      return res.status(400).json({ error: 'File path is required' })
    }

    const projPath = path.join(config.PROJECTS_DIR, name)
    const targetPath = path.join(projPath, relPath)

    // Prevent directory traversal attacks
    if (!targetPath.startsWith(projPath)) {
      return res.status(403).json({ error: 'Access denied: invalid path' })
    }

    if (isFolder) {
      await ensureDir(targetPath)
    } else {
      await ensureDir(path.dirname(targetPath))
      await fs.writeFile(targetPath, content || '')
    }

    res.status(201).json({ message: `${isFolder ? 'Folder' : 'File'} created successfully` })
  } catch (err: any) {
    res.status(500).json({ error: `Failed to create file: ${err.message}` })
  }
}

export const updateFileContent = async (req: Request, res: Response) => {
  try {
    const { name } = req.params
    const { path: relPath, content } = req.body

    if (!relPath) {
      return res.status(400).json({ error: 'File path is required' })
    }

    const projPath = path.join(config.PROJECTS_DIR, name)
    const targetPath = path.join(projPath, relPath)

    if (!targetPath.startsWith(projPath)) {
      return res.status(403).json({ error: 'Access denied: invalid path' })
    }

    // Verify it is a file and not a folder
    const stats = await fs.stat(targetPath)
    if (stats.isDirectory()) {
      return res.status(400).json({ error: 'Target path is a directory, not a file' })
    }

    await fs.writeFile(targetPath, content || '')
    res.status(200).json({ message: 'File updated successfully' })
  } catch (err: any) {
    res.status(500).json({ error: `Failed to update file content: ${err.message}` })
  }
}

export const deleteFileOrFolder = async (req: Request, res: Response) => {
  try {
    const { name } = req.params
    const { path: relPath } = req.body

    if (!relPath) {
      return res.status(400).json({ error: 'File path is required' })
    }

    const projPath = path.join(config.PROJECTS_DIR, name)
    const targetPath = path.join(projPath, relPath)

    if (!targetPath.startsWith(projPath)) {
      return res.status(403).json({ error: 'Access denied: invalid path' })
    }

    await fs.rm(targetPath, { recursive: true, force: true })
    res.status(200).json({ message: 'File or folder deleted successfully' })
  } catch (err: any) {
    res.status(500).json({ error: `Failed to delete file or folder: ${err.message}` })
  }
}

export const renameFileOrFolder = async (req: Request, res: Response) => {
  try {
    const { name } = req.params
    const { oldPath: oldRelPath, newPath: newRelPath } = req.body

    if (!oldRelPath || !newRelPath) {
      return res.status(400).json({ error: 'Old path and new path are required' })
    }

    const projPath = path.join(config.PROJECTS_DIR, name)
    const oldFullPath = path.join(projPath, oldRelPath)
    const newFullPath = path.join(projPath, newRelPath)

    if (!oldFullPath.startsWith(projPath) || !newFullPath.startsWith(projPath)) {
      return res.status(403).json({ error: 'Access denied: invalid path' })
    }

    await ensureDir(path.dirname(newFullPath))
    await fs.rename(oldFullPath, newFullPath)

    res.status(200).json({ message: 'File or folder renamed successfully' })
  } catch (err: any) {
    res.status(500).json({ error: `Failed to rename: ${err.message}` })
  }
}
