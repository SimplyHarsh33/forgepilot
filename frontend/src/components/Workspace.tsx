import { useState } from 'react'
import { useWorkspace } from '../context/WorkspaceContext'
import FileExplorer from './FileExplorer'
import CodeEditor from './CodeEditor'
import AiPanel from './AiPanel'
import LivePreview from './LivePreview'
import SettingsModal from './SettingsModal'
import { 
  Zap, Settings, HelpCircle, LogOut, Moon, Sun, 
  FolderOpen, Columns 
} from 'lucide-react'

export default function Workspace() {
  const { 
    projectName, projectType, closeProject, theme, setTheme 
  } = useWorkspace()

  const [settingsOpen, setSettingsOpen] = useState(false)
  const [rightPanelMode, setRightPanelMode] = useState<'chat' | 'preview' | 'split'>('split')
  const [sidebarExpanded, setSidebarExpanded] = useState(true)

  const toggleTheme = () => {
    setTheme(theme === 'zen' ? 'midnight' : 'zen')
  }

  return (
    <div className="h-screen w-screen flex flex-col overflow-hidden bg-[#FAF8F5] dark:bg-[#0d1117] text-[#2D312E] dark:text-[#e6edf3] font-sans">
      
      {/* ─── Header ─── */}
      <header className="h-14 border-b border-[#E6E2D8] dark:border-[#30363d] bg-[#FAF8F5] dark:bg-[#161b22] px-6 flex items-center justify-between shrink-0 select-none relative z-10">
        
        {/* Brand logo & Exit project */}
        <div className="flex items-center gap-4">
          <div 
            onClick={closeProject}
            className="flex items-center gap-2 group cursor-pointer"
            title="Return to main dashboard"
          >
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-[#869D7A] to-[#A89EC9] flex items-center justify-center text-white shadow-sm">
              <Zap size={14} fill="white" />
            </div>
            <span className="font-extrabold text-sm tracking-tight text-[#2D312E] dark:text-white">
              Forge<span className="text-[#869D7A]">Pilot</span>
            </span>
          </div>

          <div className="hidden sm:flex items-center gap-2">
            <span className="text-[#B2B8B3]">/</span>
            <div className="px-2.5 py-1 bg-[#F5F2EB] dark:bg-[#0d1117] border border-[#E6E2D8] dark:border-[#30363d] rounded-lg flex items-center gap-1.5 text-[10px] font-bold text-[#5B625E] dark:text-[#8b949e]">
              <span className={`w-1.5 h-1.5 rounded-full ${projectType === 'react' ? 'bg-[#869D7A]' : 'bg-[#A89EC9]'}`} />
              <span className="uppercase">{projectName} ({projectType})</span>
            </div>
          </div>
        </div>

        {/* Right side items */}
        <div className="flex items-center gap-2">
          
          {/* Theme switcher */}
          <button
            onClick={toggleTheme}
            title={theme === 'zen' ? 'Switch to Midnight' : 'Switch to Zen Mode'}
            className="p-2 rounded-xl bg-white dark:bg-[#0d1117] border border-[#E6E2D8] dark:border-[#30363d] hover:border-[#869D7A]/50 text-[#5B625E] dark:text-[#8b949e] hover:text-[#2D312E] dark:hover:text-[#e6edf3] transition-all"
          >
            {theme === 'zen' ? <Moon size={14} /> : <Sun size={14} />}
          </button>

          {/* Settings */}
          <button
            onClick={() => setSettingsOpen(true)}
            title="Open workspace settings"
            className="p-2 rounded-xl bg-white dark:bg-[#0d1117] border border-[#E6E2D8] dark:border-[#30363d] hover:border-[#869D7A]/50 text-[#5B625E] dark:text-[#8b949e] hover:text-[#2D312E] dark:hover:text-[#e6edf3] transition-all"
          >
            <Settings size={14} />
          </button>

          {/* Exit Workspace */}
          <button
            onClick={closeProject}
            title="Exit Project"
            className="flex items-center gap-1 px-3 py-2 rounded-xl bg-red-500/10 border border-red-500/20 hover:bg-red-500 text-red-500 hover:text-white transition-all text-xs font-semibold"
          >
            <LogOut size={12} />
            <span className="hidden sm:inline">Exit</span>
          </button>
          
        </div>

      </header>

      {/* ─── Main Shell Area ─── */}
      <div className="flex-1 flex min-h-0 relative">
        
        {/* Left Side: Activity Bar */}
        <div className="w-12 border-r border-[#E6E2D8] dark:border-[#30363d] bg-[#F5F2EB] dark:bg-[#161b22] flex flex-col items-center py-4 justify-between shrink-0 select-none">
          <div className="flex flex-col gap-4">
            <button
              onClick={() => setSidebarExpanded(!sidebarExpanded)}
              title="Toggle File Explorer sidebar"
              className={`p-2.5 rounded-xl transition-all ${
                sidebarExpanded 
                  ? 'bg-white dark:bg-[#0d1117] text-[#869D7A] shadow-sm border border-[#E6E2D8] dark:border-[#30363d]'
                  : 'text-[#5B625E] dark:text-[#8b949e] hover:text-[#2D312E] dark:hover:text-[#e6edf3]'
              }`}
            >
              <FolderOpen size={16} />
            </button>
          </div>
          <button
            onClick={() => setSettingsOpen(true)}
            className="text-[#5B625E] dark:text-[#8b949e] hover:text-[#2D312E] dark:hover:text-[#e6edf3] p-2"
          >
            <HelpCircle size={16} />
          </button>
        </div>

        {/* Collapsible File Explorer Sidebar container */}
        {sidebarExpanded && (
          <div className="w-60 border-r border-[#E6E2D8] dark:border-[#30363d] bg-[#FAF8F5] dark:bg-[#0d1117] flex flex-col shrink-0">
            <FileExplorer />
          </div>
        )}

        {/* Workspace Center Editor Panel */}
        <div className="flex-1 flex flex-col min-w-0 bg-[#FCFAF7] dark:bg-[#0d1117]">
          <CodeEditor />
        </div>

        {/* Right Split Panel Container (AI & Preview) */}
        <div className="w-[550px] md:w-[650px] border-l border-[#E6E2D8] dark:border-[#30363d] flex flex-col shrink-0">
          
          {/* Header Mode switcher bar */}
          <div className="h-9 px-4 border-b border-[#E6E2D8] dark:border-[#30363d] bg-[#F5F2EB] dark:bg-[#161b22] flex items-center justify-between shrink-0 select-none">
            
            {/* Panel Tabs list */}
            <div className="flex items-center gap-1">
              <button
                onClick={() => setRightPanelMode('chat')}
                className={`px-3 py-1 rounded-lg text-[10px] font-semibold transition-all ${
                  rightPanelMode === 'chat'
                    ? 'bg-white dark:bg-[#0d1117] border border-[#E6E2D8] dark:border-[#30363d] text-[#869D7A]'
                    : 'text-[#5B625E] dark:text-[#8b949e] hover:text-[#2D312E] dark:hover:text-[#e6edf3]'
                }`}
              >
                AI Assistant
              </button>
              <button
                onClick={() => setRightPanelMode('preview')}
                className={`px-3 py-1 rounded-lg text-[10px] font-semibold transition-all ${
                  rightPanelMode === 'preview'
                    ? 'bg-white dark:bg-[#0d1117] border border-[#E6E2D8] dark:border-[#30363d] text-[#A89EC9]'
                    : 'text-[#5B625E] dark:text-[#8b949e] hover:text-[#2D312E] dark:hover:text-[#e6edf3]'
                }`}
              >
                Sandbox Preview
              </button>
            </div>

            {/* Split Mode toggle */}
            <button
              onClick={() => setRightPanelMode(rightPanelMode === 'split' ? 'chat' : 'split')}
              className={`p-1 rounded-lg border transition-all ${
                rightPanelMode === 'split'
                  ? 'bg-white dark:bg-[#0d1117] border-[#869D7A] text-[#788E6E]'
                  : 'bg-white dark:bg-[#0d1117] border-[#E6E2D8] dark:border-[#30363d] text-[#5B625E] hover:border-[#869D7A]/50'
              }`}
              title="Split View (Side-by-Side)"
            >
              <Columns size={12} />
            </button>

          </div>

          {/* Body Container split layout */}
          <div className="flex-1 flex min-h-0 bg-[#FAF8F5] dark:bg-[#0d1117]">
            {rightPanelMode === 'chat' && <AiPanel />}
            {rightPanelMode === 'preview' && <LivePreview />}
            {rightPanelMode === 'split' && (
              <div className="flex-1 flex flex-col sm:flex-row min-h-0 divide-y sm:divide-y-0 sm:divide-x divide-[#E6E2D8] dark:divide-[#30363d]">
                <div className="flex-1 flex flex-col min-h-0">
                  <AiPanel />
                </div>
                <div className="flex-1 flex flex-col min-h-0">
                  <LivePreview />
                </div>
              </div>
            )}
          </div>

        </div>

      </div>

      {/* ─── Settings Modal ─── */}
      <SettingsModal 
        isOpen={settingsOpen}
        onClose={() => setSettingsOpen(false)}
      />

    </div>
  )
}
