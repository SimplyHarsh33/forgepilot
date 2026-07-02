import React, { useState } from 'react'
import { useWorkspace } from '../context/WorkspaceContext'
import { FolderPlus, Terminal, ArrowRight, Zap, Code } from 'lucide-react'

export default function Dashboard() {
  const { createProject } = useWorkspace()
  const [name, setName] = useState('')
  const [template, setTemplate] = useState<'react' | 'html'>('react')
  const [error, setError] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim()) {
      setError('Please enter a project name')
      return
    }
    const cleanName = name.trim().replace(/\s+/g, '-').toLowerCase()
    createProject(cleanName, template)
  }

  return (
    <div className="min-h-screen bg-[#FDFBF7] flex flex-col items-center justify-center p-6 relative overflow-hidden dot-grid">
      {/* Background blobs */}
      <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-[#869D7A]/5 rounded-full blur-[100px] -translate-x-1/3 -translate-y-1/3 pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-[#A89EC9]/5 rounded-full blur-[100px] translate-x-1/3 translate-y-1/3 pointer-events-none" />

      <div className="w-full max-w-2xl bg-[#F5F2EB]/80 backdrop-blur-md border border-[#E6E2D8] rounded-3xl p-8 md:p-12 shadow-md relative z-10">
        
        {/* Brand */}
        <div className="flex items-center gap-2.5 mb-8 justify-center">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#869D7A] to-[#A89EC9] flex items-center justify-center text-white shadow-sm">
            <Zap size={15} className="text-white" fill="white" />
          </div>
          <span className="font-extrabold text-xl text-[#2D312E] tracking-tight">
            Forge<span className="text-[#869D7A]">Pilot</span>
          </span>
        </div>

        <div className="text-center mb-10">
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
    </div>
  )
}
