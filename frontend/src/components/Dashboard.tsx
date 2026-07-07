import React, { useState } from 'react'
import { useWorkspace } from '../context/WorkspaceContext'
import { 
  Terminal, ArrowRight, Zap, Code, 
  Clock, Plus, Search, ArrowLeft, Folder 
} from 'lucide-react'

interface MockProject {
  id: string
  name: string
  type: 'react' | 'html'
  description: string
  lastModified: string
}

const MOCK_PROJECTS: MockProject[] = [
  {
    id: '1',
    name: 'personal-portfolio',
    type: 'html',
    description: 'My custom developer portfolio site with tailwind styling and animations.',
    lastModified: '2 hours ago',
  },
  {
    id: '2',
    name: 'crypto-tracker',
    type: 'react',
    description: 'React dashboard with live updates, charts, and transaction history.',
    lastModified: '1 day ago',
  },
  {
    id: '3',
    name: 'ecommerce-checkout',
    type: 'react',
    description: 'Interactive shopping cart checkout flow with local state handling.',
    lastModified: '3 days ago',
  },
  {
    id: '4',
    name: 'landing-page-sandbox',
    type: 'html',
    description: 'Clean marketing website landing page for a SaaS startup product.',
    lastModified: '1 week ago',
  },
]

export default function Dashboard() {
  const { createProject } = useWorkspace()
  const [view, setView] = useState<'list' | 'create'>('list')
  const [name, setName] = useState('')
  const [template, setTemplate] = useState<'react' | 'html'>('react')
  const [error, setError] = useState('')
  const [searchQuery, setSearchQuery] = useState('')
  const [filterType, setFilterType] = useState<'all' | 'react' | 'html'>('all')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim()) {
      setError('Please enter a project name')
      return
    }
    const cleanName = name.trim().replace(/\s+/g, '-').toLowerCase()
    createProject(cleanName, template)
  }

  const handleLaunchProject = (projectName: string, projectType: 'react' | 'html') => {
    createProject(projectName, projectType)
  }

  const filteredProjects = MOCK_PROJECTS.filter(project => {
    const matchesSearch = project.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          project.description.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesType = filterType === 'all' || project.type === filterType
    return matchesSearch && matchesType
  })

  return (
    <div className="min-h-screen bg-[#FDFBF7] flex flex-col items-center justify-start p-6 md:p-12 relative overflow-hidden dot-grid">
      {/* Background blobs */}
      <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-[#869D7A]/5 rounded-full blur-[100px] -translate-x-1/3 -translate-y-1/3 pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-[#A89EC9]/5 rounded-full blur-[100px] translate-x-1/3 translate-y-1/3 pointer-events-none" />

      {/* Top Header */}
      <div className="w-full max-w-5xl flex items-center justify-between mb-12 relative z-10">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#869D7A] to-[#A89EC9] flex items-center justify-center text-white shadow-sm">
            <Zap size={15} className="text-white" fill="white" />
          </div>
          <span className="font-extrabold text-xl text-[#2D312E] tracking-tight">
            Forge<span className="text-[#869D7A]">Pilot</span>
          </span>
        </div>
        {view === 'list' && (
          <button
            onClick={() => setView('create')}
            className="flex items-center gap-2 px-4 py-2.5 bg-[#869D7A] hover:bg-[#869D7A]/95 text-white text-xs font-bold rounded-xl transition-all shadow-sm group"
          >
            <Plus size={14} />
            <span>New Project</span>
          </button>
        )}
      </div>

      {view === 'list' ? (
        <div className="w-full max-w-5xl relative z-10 space-y-8">
          {/* Header & Subtitle */}
          <div>
            <h1 className="text-3xl font-black text-[#2D312E] tracking-tight mb-2">My Workspaces</h1>
            <p className="text-sm text-[#5B625E] max-w-xl">
              Launch one of your recent workspaces or create a new developer sandbox project to write and compile code in real-time.
            </p>
          </div>

          {/* Filters and Search */}
          <div className="flex flex-col sm:flex-row gap-4 justify-between items-center bg-[#F5F2EB]/50 border border-[#E6E2D8] p-3 rounded-2xl">
            {/* Search */}
            <div className="relative w-full sm:max-w-xs">
              <span className="absolute inset-y-0 left-3 flex items-center text-[#8A8F8B]">
                <Search size={14} />
              </span>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search projects..."
                className="w-full pl-9 pr-4 py-2 bg-[#FAF8F5] border border-[#E6E2D8] rounded-xl text-xs text-[#2D312E] placeholder-[#8A8F8B] focus:outline-none focus:border-[#869D7A] transition-colors"
              />
            </div>

            {/* Template filter tabs */}
            <div className="flex gap-1.5 p-1 bg-[#FAF8F5] border border-[#E6E2D8] rounded-xl">
              <button
                onClick={() => setFilterType('all')}
                className={`px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase transition-all ${
                  filterType === 'all'
                    ? 'bg-[#869D7A]/15 text-[#788E6E]'
                    : 'text-[#5B625E] hover:text-[#2D312E]'
                }`}
              >
                All
              </button>
              <button
                onClick={() => setFilterType('react')}
                className={`px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase transition-all ${
                  filterType === 'react'
                    ? 'bg-[#869D7A]/15 text-[#788E6E]'
                    : 'text-[#5B625E] hover:text-[#2D312E]'
                }`}
              >
                React
              </button>
              <button
                onClick={() => setFilterType('html')}
                className={`px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase transition-all ${
                  filterType === 'html'
                    ? 'bg-[#A89EC9]/15 text-[#7A61A0]'
                    : 'text-[#5B625E] hover:text-[#2D312E]'
                }`}
              >
                HTML
              </button>
            </div>
          </div>

          {/* Projects Grid */}
          {filteredProjects.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filteredProjects.map((project) => (
                <div
                  key={project.id}
                  onClick={() => handleLaunchProject(project.name, project.type)}
                  className="group bg-[#F5F2EB]/40 hover:bg-[#FAF8F5] border border-[#E6E2D8] hover:border-[#869D7A]/40 rounded-2xl p-6 cursor-pointer transition-all hover:-translate-y-1 hover:shadow-md flex flex-col justify-between h-48"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      {/* Project type icon & name */}
                      <div className="flex items-center gap-2">
                        <div className={`p-2 rounded-lg ${
                          project.type === 'react' ? 'bg-[#869D7A]/10 text-[#788E6E]' : 'bg-[#A89EC9]/10 text-[#7A61A0]'
                        }`}>
                          {project.type === 'react' ? <Code size={16} /> : <Terminal size={16} />}
                        </div>
                        <span className="font-bold text-sm text-[#2D312E]">{project.name}</span>
                      </div>

                      {/* Tech Badge */}
                      <span className={`text-[9px] px-2 py-0.5 rounded-full font-bold uppercase ${
                        project.type === 'react' 
                          ? 'bg-[#869D7A]/15 text-[#788E6E]' 
                          : 'bg-[#A89EC9]/15 text-[#7A61A0]'
                      }`}>
                        {project.type === 'react' ? 'React App' : 'HTML Sandbox'}
                      </span>
                    </div>

                    <p className="text-xs text-[#5B625E] leading-relaxed line-clamp-2">
                      {project.description}
                    </p>
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t border-[#E6E2D8]/40">
                    <div className="flex items-center gap-1.5 text-[10px] text-[#8A8F8B]">
                      <Clock size={11} />
                      <span>{project.lastModified}</span>
                    </div>

                    <div className="flex items-center gap-1 text-[11px] font-bold text-[#869D7A] group-hover:text-[#788E6E] transition-colors">
                      <span>Open Workspace</span>
                      <ArrowRight size={12} className="group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="border border-dashed border-[#E6E2D8] rounded-3xl p-12 text-center bg-[#F5F2EB]/20">
              <Folder className="mx-auto text-[#B2B8B3] mb-3" size={32} />
              <h3 className="font-bold text-[#2D312E] mb-1">No workspaces found</h3>
              <p className="text-xs text-[#5B625E] mb-4">No projects match your search query.</p>
              <button 
                onClick={() => setView('create')}
                className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#869D7A] text-white text-xs font-bold rounded-xl hover:bg-[#869D7A]/95 transition-all shadow-sm"
              >
                <Plus size={12} />
                Create New Project
              </button>
            </div>
          )}
        </div>
      ) : (
        <div className="w-full max-w-2xl bg-[#F5F2EB]/80 backdrop-blur-md border border-[#E6E2D8] rounded-3xl p-8 md:p-12 shadow-md relative z-10">
          {/* Back button */}
          <button
            onClick={() => {
              setView('list')
              setError('')
              setName('')
            }}
            className="absolute top-8 left-8 flex items-center gap-1 text-xs font-bold text-[#5B625E] hover:text-[#2D312E] transition-colors"
          >
            <ArrowLeft size={14} />
            <span>Back to projects</span>
          </button>

          <div className="text-center mb-10 mt-6">
            <h1 className="text-3xl font-black text-[#2D312E] mb-2 tracking-tight">Create a New Project</h1>
            <p className="text-sm text-[#5B625E] max-w-sm mx-auto">
              Choose a starter template and configure your workspace parameters.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8 text-left">
            {/* Project Name */}
            <div className="space-y-2">
              <label htmlFor="project-name" className="text-xs font-semibold text-[#5B625E] uppercase tracking-wider">
                Project Directory Name
              </label>
              <input
                type="text"
                id="project-name"
                value={name}
                onChange={(e) => {
                  setName(e.target.value)
                  setError('')
                }}
                placeholder="e.g. my-awesome-app"
                className="w-full px-4 py-3.5 bg-[#FAF8F5] border border-[#E6E2D8] rounded-xl text-[#2D312E] text-sm focus:outline-none focus:border-[#869D7A] transition-colors shadow-inner"
              />
              {error && <p className="text-xs text-red-500 font-medium">{error}</p>}
            </div>

            {/* Template Selectors */}
            <div className="space-y-3">
              <span className="text-xs font-semibold text-[#5B625E] uppercase tracking-wider block">
                Select Starter Template
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                
                {/* React Option */}
                <div
                  onClick={() => setTemplate('react')}
                  className={`group p-6 border rounded-2xl cursor-pointer transition-all flex flex-col justify-between h-40 ${
                    template === 'react'
                      ? 'border-[#869D7A] bg-[#869D7A]/5 shadow-sm'
                      : 'border-[#E6E2D8] bg-[#FAF8F5] hover:border-[#869D7A]/50'
                  }`}
                >
                  <div className="flex justify-between items-start">
                    <div className={`p-3 rounded-xl ${template === 'react' ? 'bg-[#869D7A] text-white' : 'bg-[#FAF8F5] border border-[#E6E2D8] text-[#788E6E]'} transition-colors`}>
                      <Code size={18} />
                    </div>
                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase ${template === 'react' ? 'bg-[#869D7A]/20 text-[#788E6E]' : 'bg-[#E6E2D8] text-[#5B625E]'}`}>
                      TSX / JSX
                    </span>
                  </div>
                  <div>
                    <h3 className="font-bold text-sm text-[#2D312E] mb-1">Vite + React App</h3>
                    <p className="text-xs text-[#5B625E] leading-normal">
                      React components compiled in-browser, supporting states, hooks, and CSS files.
                    </p>
                  </div>
                </div>

                {/* HTML Option */}
                <div
                  onClick={() => setTemplate('html')}
                  className={`group p-6 border rounded-2xl cursor-pointer transition-all flex flex-col justify-between h-40 ${
                    template === 'html'
                      ? 'border-[#A89EC9] bg-[#A89EC9]/5 shadow-sm'
                      : 'border-[#E6E2D8] bg-[#FAF8F5] hover:border-[#A89EC9]/50'
                  }`}
                >
                  <div className="flex justify-between items-start">
                    <div className={`p-3 rounded-xl ${template === 'html' ? 'bg-[#A89EC9] text-white' : 'bg-[#FAF8F5] border border-[#E6E2D8] text-[#7A61A0]'} transition-colors`}>
                      <Terminal size={18} />
                    </div>
                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase ${template === 'html' ? 'bg-[#A89EC9]/20 text-[#7A61A0]' : 'bg-[#E6E2D8] text-[#5B625E]'}`}>
                      Vanilla JS
                    </span>
                  </div>
                  <div>
                    <h3 className="font-bold text-sm text-[#2D312E] mb-1">HTML5 Sandbox</h3>
                    <p className="text-xs text-[#5B625E] leading-normal">
                      Static web environment featuring isolated scripts, style files, and Tailwind components.
                    </p>
                  </div>
                </div>

              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              className="w-full py-4 bg-gradient-to-r from-[#869D7A] to-[#A89EC9] text-white text-sm font-semibold rounded-xl hover:opacity-95 transition-all shadow-md flex items-center justify-center gap-2 group mt-6"
            >
              Launch Workspace
              <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
            </button>
            
          </form>
        </div>
      )}
    </div>
  )
}
