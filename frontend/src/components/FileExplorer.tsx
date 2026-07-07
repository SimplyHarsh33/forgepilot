import { useState } from 'react'
import { useWorkspace } from '../context/WorkspaceContext'
import { 
  Folder, FolderOpen, FileCode, Plus, Trash2, Edit, ChevronDown, ChevronRight, FileJson, 
  FileCheck, Globe 
} from 'lucide-react'

export default function FileExplorer() {
  const { 
    files, activeTab, openFile, createFile, deleteFile, renameFile 
  } = useWorkspace()

  const [expanded, setExpanded] = useState<{ [path: string]: boolean }>({
    'src': true,
    'src/components': true
  })
  
  const [editingPath, setEditingPath] = useState<string | null>(null)
  const [editingValue, setEditingValue] = useState('')
  const [creatingType, setCreatingType] = useState<{ parent: string; isFolder: boolean } | null>(null)
  const [creatingValue, setCreatingValue] = useState('')

  const toggleFolder = (path: string) => {
    setExpanded(prev => ({ ...prev, [path]: !prev[path] }))
  }

  // Get file icons matching extension
  const getFileIcon = (fileName: string) => {
    const ext = fileName.split('.').pop()
    if (ext === 'json') return <FileJson size={14} className="text-yellow-600" />
    if (ext === 'html') return <Globe size={14} className="text-orange-500" />
    if (ext === 'css') return <FileCode size={14} className="text-blue-500" />
    if (ext === 'js') return <FileCode size={14} className="text-[#a371f7]" />
    if (ext === 'tsx' || ext === 'ts' || ext === 'jsx') {
      return <FileCheck size={14} className="text-[#869D7A]" />
    }
    return <FileCode size={14} className="text-[#5B625E]" />
  }

  // Handle CRUD
  const startRename = (path: string, initialName: string) => {
    setEditingPath(path)
    setEditingValue(initialName)
  }

  const submitRename = (path: string) => {
    if (!editingValue.trim()) return
    const parts = path.split('/')
    parts[parts.length - 1] = editingValue.trim()
    const newPath = parts.join('/')
    if (newPath !== path) {
      renameFile(path, newPath)
    }
    setEditingPath(null)
  }

  const startCreate = (parentPath: string, isFolder: boolean) => {
    setCreatingType({ parent: parentPath, isFolder })
    setCreatingValue('')
    setExpanded(prev => ({ ...prev, [parentPath]: true }))
  }

  const submitCreate = () => {
    if (!creatingValue.trim() || !creatingType) return
    const newPath = creatingType.parent
      ? `${creatingType.parent}/${creatingValue.trim()}`
      : creatingValue.trim()
    createFile(newPath, '', creatingType.isFolder)
    setCreatingType(null)
  }

  // Build Explorer Tree out of Flat Path Mapping
  interface TreeNode {
    path: string
    name: string
    isFolder: boolean
    children: { [name: string]: TreeNode }
  }

  const buildTree = () => {
    const root: TreeNode = { path: '', name: 'root', isFolder: true, children: {} }
    Object.keys(files).forEach((filePath) => {
      const parts = filePath.split('/')
      let current = root
      let accumulatedPath = ''

      parts.forEach((part, index) => {
        accumulatedPath = accumulatedPath ? `${accumulatedPath}/${part}` : part
        const isLast = index === parts.length - 1
        
        if (!current.children[part]) {
          current.children[part] = {
            path: accumulatedPath,
            name: part,
            isFolder: isLast ? files[filePath].isFolder : true,
            children: {}
          }
        }
        current = current.children[part]
      })
    })
    return root
  }

  // Render Tree recursively
  const renderTree = (node: TreeNode, depth: number) => {
    const sortedChildren = Object.values(node.children).sort((a, b) => {
      if (a.isFolder && !b.isFolder) return -1
      if (!a.isFolder && b.isFolder) return 1
      return a.name.localeCompare(b.name)
    })

    return (
      <div key={node.path || 'root'} className="space-y-px">
        {node.path && (
          <div
            className={`group flex items-center justify-between py-1 px-2 rounded-lg cursor-pointer text-xs transition-colors ${
              activeTab === node.path
                ? 'bg-[#869D7A]/15 text-[#788E6E] font-semibold'
                : 'text-[#2D312E] hover:bg-[#FAF8F5]'
            }`}
            style={{ paddingLeft: `${Math.max(8, depth * 12)}px` }}
            onClick={() => node.isFolder ? toggleFolder(node.path) : openFile(node.path)}
          >
            <div className="flex items-center gap-1.5 min-w-0">
              {node.isFolder ? (
                <>
                  {expanded[node.path] ? <ChevronDown size={12} className="text-[#5B625E]" /> : <ChevronRight size={12} className="text-[#5B625E]" />}
                  {expanded[node.path] ? <FolderOpen size={13} className="text-[#A89EC9] fill-[#A89EC9]/10" /> : <Folder size={13} className="text-[#A89EC9] fill-[#A89EC9]/10" />}
                </>
              ) : (
                getFileIcon(node.name)
              )}
              
              {editingPath === node.path ? (
                <input
                  type="text"
                  value={editingValue}
                  onChange={(e) => setEditingValue(e.target.value)}
                  onBlur={() => submitRename(node.path)}
                  onKeyDown={(e) => e.key === 'Enter' && submitRename(node.path)}
                  autoFocus
                  className="px-1 py-0.5 bg-white border border-[#869D7A] rounded text-[11px] focus:outline-none text-[#2D312E]"
                  onClick={(e) => e.stopPropagation()}
                />
              ) : (
                <span className="truncate">{node.name}</span>
              )}
            </div>

            {/* Folder / File Actions on Hover */}
            {editingPath !== node.path && (
              <div className="hidden group-hover:flex items-center gap-1 shrink-0 ml-2" onClick={(e) => e.stopPropagation()}>
                {node.isFolder && (
                  <>
                    <button
                      onClick={() => startCreate(node.path, false)}
                      title="New File"
                      className="p-0.5 rounded hover:bg-black/5 text-[#5B625E] hover:text-[#2D312E]"
                    >
                      <Plus size={12} />
                    </button>
                  </>
                )}
                <button
                  onClick={() => startRename(node.path, node.name)}
                  title="Rename"
                  className="p-0.5 rounded hover:bg-black/5 text-[#5B625E] hover:text-[#2D312E]"
                >
                  <Edit size={11} />
                </button>
                <button
                  onClick={() => deleteFile(node.path)}
                  title="Delete"
                  className="p-0.5 rounded hover:bg-black/5 text-red-500 hover:bg-red-500/10"
                >
                  <Trash2 size={11} />
                </button>
              </div>
            )}
          </div>
        )}

        {/* Input box when creating file under this folder */}
        {creatingType && creatingType.parent === node.path && (
          <div 
            className="flex items-center gap-1.5 py-1"
            style={{ paddingLeft: `${Math.max(8, (depth + 1) * 12)}px` }}
          >
            {creatingType.isFolder ? <Folder size={13} className="text-[#A89EC9]" /> : <FileCode size={13} className="#5B625E" />}
            <input
              type="text"
              value={creatingValue}
              onChange={(e) => setCreatingValue(e.target.value)}
              onBlur={submitCreate}
              onKeyDown={(e) => e.key === 'Enter' && submitCreate()}
              placeholder={creatingType.isFolder ? 'Folder name...' : 'File name...'}
              autoFocus
              className="px-1 py-0.5 bg-white border border-[#869D7A] rounded text-[11px] focus:outline-none text-[#2D312E] w-28"
            />
          </div>
        )}

        {/* Children of expanded folder */}
        {node.isFolder && (node.path === '' || expanded[node.path]) && (
          <div className="space-y-px">
            {sortedChildren.map(child => renderTree(child, depth + 1))}
          </div>
        )}
      </div>
    )
  }

  const tree = buildTree()

  return (
    <div className="flex-1 flex flex-col overflow-hidden select-none">
      
      {/* Explorer Toolbar Header */}
      <div className="px-4 py-2 border-b border-[#E6E2D8] bg-[#F5F2EB] flex items-center justify-between shrink-0">
        <span className="text-[10px] font-bold text-[#5B625E] uppercase tracking-wider">
          Workspace Files
        </span>
        <div className="flex items-center gap-1">
          <button
            onClick={() => startCreate('', false)}
            title="Create File at root"
            className="p-1 rounded hover:bg-black/5 text-[#5B625E] hover:text-[#2D312E]"
          >
            <Plus size={13} />
          </button>
          <button
            onClick={() => startCreate('', true)}
            title="Create Folder at root"
            className="p-1 rounded hover:bg-black/5 text-[#5B625E] hover:text-[#2D312E]"
          >
            <Folder size={13} className="text-[#A89EC9]" />
          </button>
        </div>
      </div>

      {/* Explorer Tree List */}
      <div className="flex-1 p-2 overflow-y-auto font-mono text-[11px]">
        {renderTree(tree, -1)}
      </div>

    </div>
  )
}
