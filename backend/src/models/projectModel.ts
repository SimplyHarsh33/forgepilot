export interface Project {
  name: string
  type: 'react' | 'html'
  description?: string
  createdAt: Date
  lastModified: string
}

export interface WorkspaceFile {
  path: string
  name: string
  content: string
  isFolder: boolean
}
