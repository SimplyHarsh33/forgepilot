import { Request, Response } from 'express'
import fs from 'fs/promises'
import path from 'path'
import { config } from '../config/env'
import { Project } from '../models/projectModel'

// Helper to ensure target directory exists
async function ensureDir(dirPath: string) {
  try {
    await fs.mkdir(dirPath, { recursive: true })
  } catch (err: any) {
    if (err.code !== 'EEXIST') throw err
  }
}

// React Starter Template definitions
const REACT_FILES = {
  'package.json': `{
  "name": "forgepilot-react-app",
  "private": true,
  "version": "0.1.0",
  "type": "module",
  "dependencies": {
    "react": "^18.3.1",
    "react-dom": "^18.3.1",
    "lucide-react": "^0.395.0"
  }
}`,
  'index.html': `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>ForgePilot Virtual App</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>`,
  'src/main.tsx': `import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)`,
  'src/index.css': `@tailwind base;
@tailwind components;
@tailwind utilities;

body {
  margin: 0;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;
  background-color: #fdfbf7;
  color: #2d312e;
}`,
  'src/App.tsx': `import React from 'react'
import Navbar from './components/Navbar'
import Counter from './components/Counter'

function App() {
  return (
    <div className="min-h-screen bg-[#FDFBF7] text-[#2D312E]">
      <Navbar />
      <main className="max-w-4xl mx-auto px-6 py-20 text-center">
        <h1 className="text-5xl font-black tracking-tight mb-4">
          Welcome to your <span className="text-[#869D7A]">ForgePilot</span> Project
        </h1>
        <p className="text-[#5B625E] text-lg max-w-xl mx-auto mb-10">
          This React component is compiled client-side in real-time. Edit files in the Monaco Editor or ask the AI assistant to make modifications.
        </p>
        <Counter />
      </main>
    </div>
  )
}

export default App`,
  'src/components/Navbar.tsx': `import React from 'react'
import { Zap } from 'lucide-react'

export default function Navbar() {
  return (
    <nav className="h-16 border-b border-[#E6E2D8] bg-[#FAF8F5] flex items-center justify-between px-8">
      <div className="flex items-center gap-2 font-bold text-[#2D312E]">
        <div className="w-6 h-6 rounded bg-[#869D7A] flex items-center justify-center text-white">
          <Zap size={12} fill="white" />
        </div>
        <span>ForgePilot App</span>
      </div>
      <div className="flex gap-6 text-sm text-[#5B625E] font-medium">
        <a href="#" className="hover:text-[#2D312E]">Home</a>
        <a href="#" className="hover:text-[#2D312E]">Features</a>
        <a href="#" className="hover:text-[#2D312E]">Settings</a>
      </div>
    </nav>
  )
}`,
  'src/components/Counter.tsx': `import React, { useState } from 'react'

export default function Counter() {
  const [count, setCount] = useState(0)
  return (
    <div className="inline-flex flex-col items-center p-6 bg-[#F5F2EB] border border-[#E6E2D8] rounded-2xl shadow-sm">
      <span className="text-3xl font-extrabold text-[#2D312E] mb-2">{count}</span>
      <p className="text-xs text-[#5B625E] mb-4">React state is fully reactive inside the Sandbox</p>
      <button 
        onClick={() => setCount(c => c + 1)}
        className="px-6 py-2.5 bg-[#869D7A] hover:bg-[#869D7A]/95 text-white font-semibold rounded-lg text-sm transition-all shadow-sm"
      >
        Increment Counter
      </button>
    </div>
  )
}`
}

// HTML Starter Template definitions
const HTML_FILES = {
  'index.html': `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>ForgePilot HTML Sandbox</title>
  <!-- Load Tailwind CSS inside Sandbox -->
  <script src="https://cdn.tailwindcss.com"></script>
  <link rel="stylesheet" href="styles.css">
</head>
<body class="bg-[#FDFBF7] text-[#2D312E] min-h-screen flex flex-col justify-between">

  <nav class="h-16 border-b border-[#E6E2D8] bg-[#FAF8F5] flex items-center justify-between px-8">
    <div class="flex items-center gap-2 font-bold text-[#2D312E]">
      <span class="w-6 h-6 rounded bg-[#A89EC9] flex items-center justify-center text-white text-xs">⚡</span>
      <span>HTML project</span>
    </div>
    <div class="flex gap-6 text-sm text-[#5B625E] font-medium">
      <a href="#" class="hover:text-[#2D312E] transition-colors">Home</a>
      <a href="#" class="hover:text-[#2D312E] transition-colors">API</a>
    </div>
  </nav>

  <main class="max-w-4xl mx-auto px-6 py-20 text-center flex-1">
    <h1 class="text-5xl font-black tracking-tight mb-4">
      Pure HTML/CSS/JS Playground
    </h1>
    <p class="text-[#5B625E] text-lg max-w-xl mx-auto mb-10">
      Build statically using simple HTML tags, scripts, and CSS. Tailwind CSS classes compile dynamically inside the frame.
    </p>

    <div class="inline-flex flex-col items-center p-6 bg-[#F5F2EB] border border-[#E6E2D8] rounded-2xl shadow-sm">
      <button 
        id="counter-btn"
        class="px-6 py-2.5 bg-[#A89EC9] hover:bg-[#A89EC9]/90 text-white font-semibold rounded-lg text-sm transition-all"
      >
        Click count: <span id="counter-val">0</span>
      </button>
    </div>
  </main>

  <footer class="py-6 text-center text-xs text-[#5B625E] border-t border-[#E6E2D8] bg-[#FAF8F5]">
    ForgePilot HTML Sandbox
  </footer>

  <script src="script.js"></script>
</body>
</html>`,
  'styles.css': `/* Custom HTML styles */
h1 {
  animation: pulse-title 3s infinite ease-in-out;
}

@keyframes pulse-title {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.02); }
}`,
  'script.js': `// Dynamic script execution
let count = 0;
const btn = document.getElementById('counter-btn');
const val = document.getElementById('counter-val');

if (btn && val) {
  btn.addEventListener('click', () => {
    count++;
    val.textContent = count;
  });
}`
}

export const listProjects = async (req: Request, res: Response) => {
  try {
    const rootDir = config.PROJECTS_DIR
    await ensureDir(rootDir)

    const dirs = await fs.readdir(rootDir, { withFileTypes: true })
    const projects: Project[] = []

    for (const dir of dirs) {
      if (dir.isDirectory()) {
        const projPath = path.join(rootDir, dir.name)
        const stats = await fs.stat(projPath)
        
        // Read .metadata.json in project folder if exists to check type, default by checking files
        let type: 'react' | 'html' = 'html'
        let description = 'Static web workspace environment.'

        try {
          const metaPath = path.join(projPath, '.metadata.json')
          const metaRaw = await fs.readFile(metaPath, 'utf-8')
          const meta = JSON.parse(metaRaw)
          type = meta.type || 'html'
          description = meta.description || description
        } catch {
          // If no metadata, detect by checking if src folder exists
          try {
            await fs.access(path.join(projPath, 'src'))
            type = 'react'
            description = 'Vite + React workspace application.'
          } catch {
            type = 'html'
          }
        }

        projects.push({
          name: dir.name,
          type,
          description,
          createdAt: stats.birthtime,
          lastModified: 'Updated recently'
        })
      }
    }

    res.status(200).json(projects)
  } catch (err: any) {
    res.status(500).json({ error: `Failed to list projects: ${err.message}` })
  }
}

export const createProject = async (req: Request, res: Response) => {
  try {
    const { name, type, description } = req.body
    if (!name || !type) {
      return res.status(400).json({ error: 'Project name and type are required' })
    }

    const cleanName = name.trim().replace(/\s+/g, '-').toLowerCase()
    const projPath = path.join(config.PROJECTS_DIR, cleanName)

    // Check if directory already exists
    try {
      await fs.access(projPath)
      return res.status(400).json({ error: `Project '${cleanName}' already exists` })
    } catch {
      // Doesn't exist, proceed
    }

    await ensureDir(projPath)

    // Write metadata
    const metadata = {
      name: cleanName,
      type,
      description: description || (type === 'react' ? 'Vite + React workspace application.' : 'Static web workspace environment.'),
      createdAt: new Date().toISOString()
    }
    await fs.writeFile(path.join(projPath, '.metadata.json'), JSON.stringify(metadata, null, 2))

    // Populate initial files
    const templateFiles = type === 'react' ? REACT_FILES : HTML_FILES

    for (const [filePath, content] of Object.entries(templateFiles)) {
      const fullPath = path.join(projPath, filePath)
      await ensureDir(path.dirname(fullPath))
      await fs.writeFile(fullPath, content)
    }

    res.status(201).json({
      name: cleanName,
      type,
      description: metadata.description,
      message: 'Project created successfully'
    })
  } catch (err: any) {
    res.status(500).json({ error: `Failed to create project: ${err.message}` })
  }
}
