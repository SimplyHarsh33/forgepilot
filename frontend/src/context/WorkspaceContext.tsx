import React, { createContext, useContext, useState, useEffect } from 'react'
import confetti from 'canvas-confetti'

export interface WorkspaceFile {
  path: string
  name: string
  content: string
  isFolder: boolean
  isAiGenerated?: boolean
  isModified?: boolean
}

export interface ChatMessage {
  id: string
  sender: 'user' | 'assistant'
  text: string
  timestamp: Date
  isPending?: boolean
}

export interface LLMConfig {
  provider: 'simulated' | 'gemini'
  apiKey: string
  model: string
}

interface WorkspaceContextProps {
  projectName: string
  projectType: 'react' | 'html' | null
  files: { [path: string]: WorkspaceFile }
  openTabs: string[]
  activeTab: string | null
  chatHistory: ChatMessage[]
  isGenerating: boolean
  llmConfig: LLMConfig
  theme: 'zen' | 'midnight'
  activeSidebarTab: 'explorer' | 'chat' | 'settings'
  compilerLogs: string[]
  
  loadProject: (name: string, type: 'react' | 'html') => Promise<void>
  createProject: (name: string, type: 'react' | 'html') => Promise<void>
  closeProject: () => void
  createFile: (path: string, content: string, isFolder: boolean) => void
  deleteFile: (path: string) => void
  renameFile: (oldPath: string, newPath: string) => void
  updateFileContent: (path: string, content: string) => void
  saveFile: (path: string) => Promise<void>
  openFile: (path: string) => void
  closeFile: (path: string) => void
  setActiveTab: (path: string | null) => void
  sendMessage: (text: string) => Promise<void>
  setLlmConfig: (config: LLMConfig) => void
  setTheme: (theme: 'zen' | 'midnight') => void
  setActiveSidebarTab: (tab: 'explorer' | 'chat' | 'settings') => void
  addCompilerLog: (log: string) => void
  clearCompilerLogs: () => void
}

const BACKEND_URL = 'http://localhost:5000'

const WorkspaceContext = createContext<WorkspaceContextProps | undefined>(undefined)



export const WorkspaceProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [projectName, setProjectName] = useState<string>('')
  const [projectType, setProjectType] = useState<'react' | 'html' | null>(null)
  const [files, setFiles] = useState<{ [path: string]: WorkspaceFile }>({})
  const [openTabs, setOpenTabs] = useState<string[]>([])
  const [activeTab, setActiveTab] = useState<string | null>(null)
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([])
  const [isGenerating, setIsGenerating] = useState<boolean>(false)
  const [theme, setTheme] = useState<'zen' | 'midnight'>('zen')
  const [activeSidebarTab, setActiveSidebarTab] = useState<'explorer' | 'chat' | 'settings'>('explorer')
  const [compilerLogs, setCompilerLogs] = useState<string[]>([])

  const [llmConfig, setLlmConfig] = useState<LLMConfig>(() => {
    const saved = localStorage.getItem('forgepilot_llm_config')
    return saved
      ? JSON.parse(saved)
      : { provider: 'simulated', apiKey: '', model: 'gemini-1.5-flash' }
  })

  useEffect(() => {
    localStorage.setItem('forgepilot_llm_config', JSON.stringify(llmConfig))
  }, [llmConfig])

  // Synchronize CSS variable theme
  useEffect(() => {
    const root = document.documentElement
    if (theme === 'zen') {
      root.classList.remove('dark')
    } else {
      root.classList.add('dark')
    }
  }, [theme])

  const loadProject = async (name: string, type: 'react' | 'html') => {
    try {
      const response = await fetch(`${BACKEND_URL}/files?project=${name}`)
      if (!response.ok) throw new Error('Failed to load project files')
      const data = await response.json()
      
      setProjectName(name)
      setProjectType(type)
      setFiles(data)
      
      if (type === 'react') {
        const defaultTabs = ['src/App.tsx', 'src/components/Counter.tsx'].filter(t => data[t])
        setOpenTabs(defaultTabs)
        setActiveTab(defaultTabs.length > 0 ? defaultTabs[0] : null)
      } else {
        const defaultTabs = ['index.html', 'script.js'].filter(t => data[t])
        setOpenTabs(defaultTabs)
        setActiveTab(defaultTabs.length > 0 ? defaultTabs[0] : null)
      }
      
      setChatHistory([
        {
          id: 'welcome',
          sender: 'assistant',
          text: `Welcome to **` + name + `**! I'm your ForgePilot assistant. I can write and edit code in your project.`,
          timestamp: new Date(),
        },
      ])
      setCompilerLogs([`[ForgePilot] Project "` + name + `" loaded successfully.`, `[Sandbox] Virtual web-server listening on port 3000...`])
    } catch (err: any) {
      console.error(err)
      alert(err.message)
    }
  }

  const createProject = async (name: string, type: 'react' | 'html') => {
    try {
      const response = await fetch(`${BACKEND_URL}/projects`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, type }),
      })
      if (!response.ok) throw new Error('Failed to create project')
      
      await loadProject(name, type)
    } catch (err: any) {
      console.error(err)
      alert(err.message)
    }
  }

  const closeProject = () => {
    setProjectName('')
    setProjectType(null)
    setFiles({})
    setOpenTabs([])
    setActiveTab(null)
    setChatHistory([])
    setCompilerLogs([])
  }

  const createFile = (path: string, content: string, isFolder: boolean) => {
    setFiles((prev) => {
      // Create intermediate directories if necessary
      const newFiles = { ...prev }
      const parts = path.split('/')
      let currentPath = ''
      
      for (let i = 0; i < parts.length - 1; i++) {
        currentPath = currentPath ? `${currentPath}/${parts[i]}` : parts[i]
        if (!newFiles[currentPath]) {
          newFiles[currentPath] = {
            path: currentPath,
            name: parts[i],
            content: '',
            isFolder: true,
          }
        }
      }

      newFiles[path] = {
        path,
        name: parts[parts.length - 1],
        content,
        isFolder,
        isAiGenerated: true,
      }
      return newFiles
    })

    if (!isFolder) {
      setOpenTabs((prev) => {
        if (!prev.includes(path)) {
          return [...prev, path]
        }
        return prev
      })
      setActiveTab(path)
    }
  }

  const deleteFile = (path: string) => {
    setFiles((prev) => {
      const newFiles = { ...prev }
      // Delete target and any child paths recursively (for folders)
      Object.keys(newFiles).forEach((filePath) => {
        if (filePath === path || filePath.startsWith(`${path}/`)) {
          delete newFiles[filePath]
        }
      })
      return newFiles
    })

    setOpenTabs((prev) => prev.filter((t) => t !== path && !t.startsWith(`${path}/`)))
    if (activeTab === path || (activeTab && activeTab.startsWith(`${path}/`))) {
      setActiveTab(null)
    }
  }

  const renameFile = (oldPath: string, newPath: string) => {
    setFiles((prev) => {
      const newFiles = { ...prev }
      const target = newFiles[oldPath]
      if (!target) return prev

      delete newFiles[oldPath]
      
      const newParts = newPath.split('/')
      target.path = newPath
      target.name = newParts[newParts.length - 1]
      newFiles[newPath] = target

      // For folders, rename child elements
      if (target.isFolder) {
        Object.keys(newFiles).forEach((filePath) => {
          if (filePath.startsWith(`${oldPath}/`)) {
            const childTarget = newFiles[filePath]
            const childRelative = filePath.substring(oldPath.length)
            const childNewPath = `${newPath}${childRelative}`
            
            delete newFiles[filePath]
            childTarget.path = childNewPath
            newFiles[childNewPath] = childTarget
          }
        })
      }

      return newFiles
    })

    setOpenTabs((prev) =>
      prev.map((t) => {
        if (t === oldPath) return newPath
        if (t.startsWith(`${oldPath}/`)) {
          return `${newPath}${t.substring(oldPath.length)}`
        }
        return t
      })
    )

    if (activeTab === oldPath) {
      setActiveTab(newPath)
    } else if (activeTab && activeTab.startsWith(`${oldPath}/`)) {
      setActiveTab(`${newPath}${activeTab.substring(oldPath.length)}`)
    }
  }

  const updateFileContent = (path: string, content: string) => {
    setFiles((prev) => {
      if (!prev[path]) return prev
      return {
        ...prev,
        [path]: {
          ...prev[path],
          content,
          isModified: true,
        },
      }
    })
  }

  const saveFile = async (path: string) => {
    const file = files[path]
    if (!file) return

    try {
      const response = await fetch(`${BACKEND_URL}/save`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ project: projectName, path, content: file.content }),
      })
      if (!response.ok) throw new Error('Failed to save file')
      
      setFiles((prev) => {
        if (!prev[path]) return prev
        return {
          ...prev,
          [path]: {
            ...prev[path],
            isModified: false,
          },
        }
      })
      addCompilerLog(`[Sandbox] Saved file: ${path}`)
    } catch (err: any) {
      console.error(err)
      addCompilerLog(`[Error] Failed to save file: ${path}`)
    }
  }

  const openFile = (path: string) => {
    setOpenTabs((prev) => {
      if (!prev.includes(path)) {
        return [...prev, path]
      }
      return prev
    })
    setActiveTab(path)
  }

  const closeFile = (path: string) => {
    setOpenTabs((prev) => {
      const nextTabs = prev.filter((t) => t !== path)
      if (activeTab === path) {
        setActiveTab(nextTabs.length > 0 ? nextTabs[nextTabs.length - 1] : null)
      }
      return nextTabs
    })
  }

  const addCompilerLog = (log: string) => {
    setCompilerLogs((prev) => [...prev, log].slice(-100)) // Cap at 100 logs
  }

  const clearCompilerLogs = () => {
    setCompilerLogs([])
  }

  // Simulated AI Component templates
  const getSimulatedAiResponse = (userPrompt: string): { message: string; actions?: any[] } => {
    const promptLower = userPrompt.toLowerCase()
    
    // Check template triggers
    if (promptLower.includes('navbar') || promptLower.includes('header')) {
      const isReact = projectType === 'react'
      const path = isReact ? 'src/components/Navbar.tsx' : 'navbar.html'
      const appPath = 'src/App.tsx'
      
      const reactNavbarCode = `import React from 'react'
import { Sparkles, Menu, Code2, Heart } from 'lucide-react'

export default function Navbar() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-[#FDFBF7]/80 backdrop-blur-md border-b border-[#E6E2D8] shadow-sm">
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        <div className="flex items-center gap-2 group cursor-pointer">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#869D7A] to-[#A89EC9] flex items-center justify-center text-white shadow-sm">
            <Sparkles size={16} fill="white" />
          </div>
          <span className="font-bold text-lg text-[#2D312E]">Pastel<span className="text-[#869D7A]">App</span></span>
        </div>
        <div className="hidden md:flex items-center gap-8 text-sm font-medium text-[#5B625E]">
          <a href="#" className="hover:text-[#2D312E] transition-colors">Workspace</a>
          <a href="#" className="hover:text-[#2D312E] transition-colors">Components</a>
          <a href="#" className="hover:text-[#2D312E] transition-colors">API Keys</a>
        </div>
        <div className="flex items-center gap-3">
          <button className="px-4 py-2 text-xs font-semibold text-[#5B625E] hover:text-[#2D312E] transition-colors">Log In</button>
          <button className="px-4 py-2 text-xs font-semibold text-white bg-[#869D7A] hover:bg-[#869D7A]/95 rounded-lg shadow-sm transition-all">Get Started</button>
        </div>
      </div>
    </nav>
  )
}`

      const reactAppCode = `import React from 'react'
import Navbar from './components/Navbar'
import Counter from './components/Counter'

function App() {
  return (
    <div className="min-h-screen bg-[#FDFBF7] text-[#2D312E] pt-16">
      <Navbar />
      <main className="max-w-4xl mx-auto px-6 py-20 text-center">
        <h1 className="text-5xl font-black tracking-tight mb-4">
          Welcome to your <span className="text-[#869D7A]">ForgePilot</span> Project
        </h1>
        <p className="text-[#5B625E] text-lg max-w-xl mx-auto mb-10">
          I've generated a modern responsive Navbar with backdrop blurs and a sleek glass theme. Check it out!
        </p>
        <Counter />
      </main>
    </div>
  )
}

export default App`

      const htmlNavbarCode = `<div class="bg-[#FDFBF7]/85 backdrop-blur-md border-b border-[#E6E2D8] fixed top-0 w-full z-50">
  <div class="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
    <div class="flex items-center gap-2 font-bold text-[#2D312E] cursor-pointer">
      <div class="w-8 h-8 rounded-lg bg-gradient-to-br from-[#869D7A] to-[#A89EC9] flex items-center justify-center text-white text-xs">⚡</div>
      <span>HTML Workspace</span>
    </div>
    <div class="flex gap-6 text-sm text-[#5B625E] font-medium">
      <a href="#" class="hover:text-[#2D312E] transition-colors">Home</a>
      <a href="#" class="hover:text-[#2D312E] transition-colors">Layouts</a>
      <a href="#" class="hover:text-[#2D312E] transition-colors">Settings</a>
    </div>
  </div>
</div>`

      if (isReact) {
        return {
          message: `I have created the responsive 'Navbar.tsx' component inside 'src/components/' and imported it directly in 'src/App.tsx' so it renders immediately in your live preview!

### What I did:
1. Created 'src/components/Navbar.tsx' using **Tailwind CSS** styling and **Lucide React** icons.
2. Updated 'src/App.tsx' to import 'Navbar' and added top padding to clear the fixed bar.`,
          actions: [
            { action: 'create', path, content: reactNavbarCode },
            { action: 'modify', path: appPath, content: reactAppCode }
          ]
        }
      } else {
        return {
          message: `I have generated a responsive Navbar component and created 'navbar.html'. To display it on your main page, open your 'index.html' and copy it into the body!`,
          actions: [
            { action: 'create', path, content: htmlNavbarCode }
          ]
        }
      }
    }

    if (promptLower.includes('todo') || promptLower.includes('task list')) {
      const isReact = projectType === 'react'
      const path = isReact ? 'src/components/TodoList.tsx' : 'todo.html'
      
      const reactTodoCode = `import React, { useState } from 'react'
import { Plus, Trash2, CheckCircle, Circle } from 'lucide-react'

interface TodoItem {
  id: number
  text: string
  completed: boolean
}

export default function TodoList() {
  const [todos, setTodos] = useState<TodoItem[]>([
    { id: 1, text: 'Design the ForgePilot workspace', completed: true },
    { id: 2, text: 'Integrate Monaco editor tabs', completed: false },
    { id: 3, text: 'Build client-side React compiler', completed: false }
  ])
  const [input, setInput] = useState('')

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim()) return
    setTodos([...todos, { id: Date.now(), text: input.trim(), completed: false }])
    setInput('')
  }

  const toggleTodo = (id: number) => {
    setTodos(todos.map(t => t.id === id ? { ...t, completed: !t.completed } : t))
  }

  const deleteTodo = (id: number) => {
    setTodos(todos.filter(t => t.id !== id))
  }

  return (
    <div className="max-w-md mx-auto p-6 bg-[#FAF8F5] border border-[#E6E2D8] rounded-2xl shadow-sm text-left my-8">
      <h2 className="text-xl font-bold text-[#2D312E] mb-4 flex items-center gap-2">
        <span className="w-5 h-5 rounded-full bg-[#A89EC9] flex items-center justify-center text-white text-xs">✓</span>
        Task Checklist
      </h2>
      <form onSubmit={handleAdd} className="flex gap-2 mb-4">
        <input 
          type="text" 
          value={input} 
          onChange={e => setInput(e.target.value)}
          placeholder="Add a new task..." 
          className="flex-1 px-3 py-2 bg-[#F5F2EB] border border-[#E6E2D8] rounded-lg text-sm focus:outline-none focus:border-[#869D7A] text-[#2D312E]"
        />
        <button type="submit" className="p-2 bg-[#869D7A] text-white rounded-lg hover:bg-[#869D7A]/90 transition-all flex items-center justify-center shadow-sm">
          <Plus size={16} />
        </button>
      </form>
      <ul className="space-y-2">
        {todos.map(todo => (
          <li 
            key={todo.id}
            className="flex items-center justify-between p-3 bg-[#F5F2EB] border border-[#E6E2D8]/50 rounded-xl hover:border-[#869D7A]/30 transition-all cursor-pointer"
            onClick={() => toggleTodo(todo.id)}
          >
            <div className="flex items-center gap-3">
              <button className="text-[#869D7A]">
                {todo.completed ? <CheckCircle size={16} fill="#869D7A" className="text-white" /> : <Circle size={16} />}
              </button>
              <span className={\`text-sm \${todo.completed ? 'line-through text-[#8A8F8B]' : 'text-[#2D312E]'}\`}>
                {todo.text}
              </span>
            </div>
            <button 
              onClick={(e) => { e.stopPropagation(); deleteTodo(todo.id); }}
              className="text-[#8A8F8B] hover:text-red-500 p-1"
            >
              <Trash2 size={14} />
            </button>
          </li>
        ))}
      </ul>
    </div>
  )
}`

      const reactAppCode = `import React from 'react'
import Navbar from './components/Navbar'
import TodoList from './components/TodoList'

function App() {
  return (
    <div className="min-h-screen bg-[#FDFBF7] text-[#2D312E]">
      <Navbar />
      <main className="max-w-4xl mx-auto px-6 py-12 text-center">
        <h1 className="text-5xl font-black tracking-tight mb-4">
          Checklist Manager
        </h1>
        <p className="text-[#5B625E] text-lg max-w-xl mx-auto mb-6">
          I've generated a fully functional Todo Task List component with local state updates!
        </p>
        <TodoList />
      </main>
    </div>
  )
}

export default App`

      if (isReact) {
        return {
          message: `I have generated a fully interactive **Todo List** task manager component at 'src/components/TodoList.tsx' and linked it in 'src/App.tsx'!

### Features:
- Local React component state handling addition and deletion.
- Completed status toggle with clean animations and icon swaps.
- Styled with our calming Zen color palette and icons.`,
          actions: [
            { action: 'create', path, content: reactTodoCode },
            { action: 'modify', path: 'src/App.tsx', content: reactAppCode }
          ]
        }
      } else {
        return {
          message: `I have generated an HTML/JS Todo List widget inside 'todo.html'. Check it out in the file explorer!`,
          actions: [
            { action: 'create', path, content: `<!-- Todo List template -->` }
          ]
        }
      }
    }

    if (promptLower.includes('card') || promptLower.includes('grid')) {
      const isReact = projectType === 'react'
      const path = isReact ? 'src/components/CardGrid.tsx' : 'grid.html'
      
      const reactCardCode = `import React from 'react'
import { ArrowRight } from 'lucide-react'

export default function CardGrid() {
  const items = [
    { title: 'Sage Aesthetics', tag: 'Design', color: 'bg-[#869D7A]/10 text-[#788E6E]', desc: 'Exploring natural green layouts to calm developers.' },
    { title: 'Lavender Breeze', tag: 'Aura', color: 'bg-[#A89EC9]/10 text-[#7A61A0]', desc: 'Soothing violet tones for evening programming.' },
    { title: 'Peach Shimmer', tag: 'Zen', color: 'bg-[#D4A373]/10 text-[#D4A373]', desc: 'Copper highlights to give a warm, organic visual.' }
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 my-10">
      {items.map((item, idx) => (
        <div key={idx} className="group p-6 bg-[#FAF8F5] border border-[#E6E2D8] rounded-2xl hover:translate-y-[-4px] hover:shadow-md hover:border-[#869D7A]/30 transition-all text-left">
          <span className={\`inline-block px-2.5 py-0.5 rounded-full text-xs font-semibold mb-4 \${item.color}\`}>
            {item.tag}
          </span>
          <h3 className="text-lg font-bold text-[#2D312E] mb-2">{item.title}</h3>
          <p className="text-sm text-[#5B625E] leading-relaxed mb-6">{item.desc}</p>
          <a href="#" className="inline-flex items-center gap-1 text-xs font-bold text-[#869D7A] hover:text-[#869D7A]/80">
            Read Article
            <ArrowRight size={12} className="group-hover:translate-x-1 transition-transform" />
          </a>
        </div>
      ))}
    </div>
  )
}`

      const reactAppCode = `import React from 'react'
import Navbar from './components/Navbar'
import CardGrid from './components/CardGrid'

function App() {
  return (
    <div className="min-h-screen bg-[#FDFBF7] text-[#2D312E]">
      <Navbar />
      <main className="max-w-5xl mx-auto px-6 py-16 text-center">
        <h1 className="text-5xl font-black tracking-tight mb-4">
          Premium Articles
        </h1>
        <p className="text-[#5B625E] text-lg max-w-xl mx-auto mb-6">
          A gorgeous pastel grid with hover-animations and tags.
        </p>
        <CardGrid />
      </main>
    </div>
  )
}

export default App`

      if (isReact) {
        return {
          message: `I have generated a responsive **Card Grid** inside 'src/components/CardGrid.tsx' and linked it inside your 'src/App.tsx'!

### Features:
- Multi-column flexible layout (grid-cols-1 to md:grid-cols-3).
- Soft badge tags with matched backgrounds and labels.
- Micro-animations for card hovers and arrow movements.`,
          actions: [
            { action: 'create', path, content: reactCardCode },
            { action: 'modify', path: 'src/App.tsx', content: reactAppCode }
          ]
        }
      } else {
        return {
          message: `I have generated a responsive HTML card layout in 'grid.html'. Check it out in the explorer!`,
          actions: [
            { action: 'create', path, content: `<!-- Grid structure -->` }
          ]
        }
      }
    }

    // Default Fallback
    const fallbackReactCode = `import React from 'react'

export default function CustomWidget() {
  return (
    <div className="p-8 bg-[#FAF8F5] border border-[#E6E2D8] rounded-2xl shadow-sm max-w-sm mx-auto text-left my-8">
      <h3 className="text-lg font-bold text-[#2D312E] mb-2">Custom Widget</h3>
      <p className="text-sm text-[#5B625E] mb-4">
        I created this placeholder widget based on your request.
      </p>
      <div className="p-3 bg-[#F5F2EB] rounded-xl border border-[#E6E2D8] text-xs text-[#8A8F8B] font-mono">
        Edit this file in Monaco Editor
      </div>
    </div>
  )
}`

    return {
      message: `I have created a basic component at 'src/components/CustomWidget.tsx' to get you started!

> [!TIP]
> **Get full AI capabilities!** Paste a real **Gemini API Key** in the **Settings** tab. This allows me to read all your files and generate custom components matching any prompt you enter!`,
      actions: [
        { action: 'create', path: 'src/components/CustomWidget.tsx', content: fallbackReactCode },
        {
          action: 'modify',
          path: 'src/App.tsx',
          content: `import React from 'react'
import Navbar from './components/Navbar'
import CustomWidget from './components/CustomWidget'

function App() {
  return (
    <div className="min-h-screen bg-[#FDFBF7] text-[#2D312E]">
      <Navbar />
      <main className="max-w-4xl mx-auto px-6 py-20 text-center">
        <h1 className="text-5xl font-black tracking-tight mb-4">ForgePilot Sandbox</h1>
        <p className="text-[#5B625E] mb-10">Connected in simulated mode.</p>
        <CustomWidget />
      </main>
    </div>
  )
}
export default App`
        }
      ]
    }
  }

  const sendMessage = async (text: string) => {
    if (!text.trim()) return

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text,
      timestamp: new Date(),
    }

    setChatHistory((prev) => [...prev, userMsg])
    setIsGenerating(true)

    const botMsgId = `bot-${Date.now()}`
    const botPendingMsg: ChatMessage = {
      id: botMsgId,
      sender: 'assistant',
      text: '',
      timestamp: new Date(),
      isPending: true,
    }
    setChatHistory((prev) => [...prev, botPendingMsg])

    try {
      if (llmConfig.provider === 'simulated') {
        // Mock a streaming response with timeout
        await new Promise((resolve) => setTimeout(resolve, 2000))
        
        const simulated = getSimulatedAiResponse(text)
        
        // Apply actions
        if (simulated.actions) {
          simulated.actions.forEach((act: any) => {
            if (act.action === 'create') {
              createFile(act.path, act.content, false)
            } else if (act.action === 'modify') {
              updateFileContent(act.path, act.content)
            } else if (act.action === 'delete') {
              deleteFile(act.path)
            }
          })
          
          confetti({
            particleCount: 80,
            spread: 50,
            origin: { y: 0.8 },
            colors: ['#869D7A', '#A89EC9', '#FAF8F5'],
          })
        }

        setChatHistory((prev) =>
          prev.map((msg) =>
            msg.id === botMsgId
              ? {
                  ...msg,
                  text: simulated.message,
                  isPending: false,
                }
              : msg
          )
        )
      } else {
        // Route API call through backend proxy
        // API key is optional here — the backend reads GEMINI_API_KEY from its .env
        // The user can also override with a custom key via the Settings panel
        const messagesPayload = [
          { role: 'user', content: text }
        ]

        const response = await fetch(`${BACKEND_URL}/chat`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            messages: messagesPayload,
            workspaceFiles: files,
            apiKey: llmConfig.apiKey || undefined,
            model: llmConfig.model,
          }),
        })

        if (!response.ok) {
          const errData = await response.json().catch(() => ({}))
          throw new Error(errData.error || `API call failed with status: ${response.status}`)
        }

        const data = await response.json()
        const textResponse = data.reply || ''

        if (!textResponse) {
          throw new Error('No content returned from API.')
        }

        // Parse workspace actions
        const actionRegex = /```json-workspace-action\n([\s\S]*?)\n```/
        const match = textResponse.match(actionRegex)
        let parsedMessage = textResponse.replace(actionRegex, '').trim()

        if (match) {
          try {
            const actionData = JSON.parse(match[1])
            if (actionData.actions && Array.isArray(actionData.actions)) {
              actionData.actions.forEach((act: any) => {
                if (act.action === 'create') {
                  createFile(act.path, act.content, false)
                } else if (act.action === 'modify') {
                  updateFileContent(act.path, act.content)
                } else if (act.action === 'delete') {
                  deleteFile(act.path)
                }
              })

              confetti({
                particleCount: 100,
                spread: 60,
                origin: { y: 0.85 },
                colors: ['#869D7A', '#A89EC9', '#FAF8F5'],
              })
            }
          } catch (e: any) {
            console.error('Failed to parse actions from Gemini response', e)
            parsedMessage += `\n\n*(Error parsing file updates: ${e.message})*`
          }
        }

        setChatHistory((prev) =>
          prev.map((msg) =>
            msg.id === botMsgId
              ? {
                  ...msg,
                  text: parsedMessage,
                  isPending: false,
                }
              : msg
          )
        )
      }
    } catch (err: any) {
      setChatHistory((prev) =>
        prev.map((msg) =>
          msg.id === botMsgId
            ? {
                ...msg,
                text: `❌ **Error:** ${err.message}`,
                isPending: false,
              }
            : msg
        )
      )
    } finally {
      setIsGenerating(false)
    }
  }

  return (
    <WorkspaceContext.Provider
      value={{
        projectName,
        projectType,
        files,
        openTabs,
        activeTab,
        chatHistory,
        isGenerating,
        llmConfig,
        theme,
        activeSidebarTab,
        compilerLogs,
        loadProject,
        createProject,
        closeProject,
        createFile,
        deleteFile,
        renameFile,
        updateFileContent,
        saveFile,
        openFile,
        closeFile,
        setActiveTab,
        sendMessage,
        setLlmConfig,
        setTheme,
        setActiveSidebarTab,
        addCompilerLog,
        clearCompilerLogs,
      }}
    >
      {children}
    </WorkspaceContext.Provider>
  )
}

export const useWorkspace = () => {
  const context = useContext(WorkspaceContext)
  if (!context) throw new Error('useWorkspace must be used within WorkspaceProvider')
  return context
}
