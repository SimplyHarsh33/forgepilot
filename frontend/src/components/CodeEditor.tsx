import { useRef, useEffect, useState } from 'react'
import Editor, { Monaco } from '@monaco-editor/react'
import { useWorkspace } from '../context/WorkspaceContext'
import { Zap, X, Save, Terminal as TerminalIcon, Trash2, Copy, ChevronDown, ChevronUp, AlertCircle, Check } from 'lucide-react'

export default function CodeEditor() {
  const { 
    files, openTabs, activeTab, updateFileContent, openFile, closeFile, theme, projectType, saveFile,
    compilerLogs, clearCompilerLogs
  } = useWorkspace()

  const editorRef = useRef<any>(null)
  const terminalEndRef = useRef<HTMLDivElement>(null)

  const [terminalOpen, setTerminalOpen] = useState(false)
  const [terminalTab, setTerminalTab] = useState<'all' | 'errors'>('all')
  const [copied, setCopied] = useState(false)

  // Auto-scroll terminal on new log entries
  useEffect(() => {
    if (terminalOpen) {
      terminalEndRef.current?.scrollIntoView({ behavior: 'smooth' })
    }
  }, [compilerLogs, terminalOpen])

  const handleCopyLogs = () => {
    navigator.clipboard.writeText(compilerLogs.join('\n'))
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  // Ctrl+S key listener for saving active document
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 's') {
        e.preventDefault()
        if (activeTab && files[activeTab]?.isModified) {
          saveFile(activeTab)
        }
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [activeTab, files, saveFile])

  const activeFile = activeTab ? files[activeTab] : null

  const getLanguage = (path: string) => {
    const ext = path.split('.').pop()
    if (ext === 'html') return 'html'
    if (ext === 'css') return 'css'
    if (ext === 'js' || ext === 'jsx') return 'javascript'
    if (ext === 'ts' || ext === 'tsx') return 'typescript'
    if (ext === 'json') return 'json'
    return 'plaintext'
  }

  // Register Custom Editor Themes
  const handleEditorWillMount = (monaco: Monaco) => {
    // Pastel Zen Light Theme
    monaco.editor.defineTheme('pastelZen', {
      base: 'vs',
      inherit: true,
      rules: [
        { token: 'comment', foreground: '8A8F8B', fontStyle: 'italic' },
        { token: 'keyword', foreground: '9B4F4F', fontStyle: 'bold' },
        { token: 'string', foreground: '4F7B9B' },
        { token: 'number', foreground: 'D4A373' },
        { token: 'type', foreground: '7A61A0' },
        { token: 'delimiter', foreground: '5B625E' },
      ],
      colors: {
        'editor.background': '#FCFAF7',
        'editor.foreground': '#2D312E',
        'editorLineNumber.foreground': '#B2B8B3',
        'editorLineNumber.activeForeground': '#869D7A',
        'editor.lineHighlightBackground': '#F5F2EB',
        'editor.selectionBackground': '#E3E0F3',
        'editorCursor.foreground': '#869D7A',
      }
    })

    // Cyber Midnight Dark Theme
    monaco.editor.defineTheme('cyberMidnight', {
      base: 'vs-dark',
      inherit: true,
      rules: [],
      colors: {
        'editor.background': '#0d1117',
        'editor.foreground': '#e6edf3',
        'editorLineNumber.foreground': '#30363d',
        'editorLineNumber.activeForeground': '#58a6ff',
        'editor.lineHighlightBackground': '#161b22',
        'editor.selectionBackground': 'rgba(88, 166, 255, 0.25)',
      }
    })
  }

  const handleEditorMount = (editor: any) => {
    editorRef.current = editor
  }

  // Update theme inside Monaco dynamically
  const editorTheme = theme === 'zen' ? 'pastelZen' : 'cyberMidnight'

  return (
    <div className="flex-1 flex flex-col overflow-hidden bg-[#FCFAF7] dark:bg-[#0d1117]">
      
      {/* Tabs Row Bar */}
      {openTabs.length > 0 && (
        <div className="flex items-center justify-between h-9 border-b border-[#E6E2D8] dark:border-[#30363d] bg-[#F5F2EB] dark:bg-[#161b22] shrink-0 select-none">
          {/* Scrollable tabs */}
          <div className="flex items-center h-full overflow-x-auto scrollbar-none flex-1">
            {openTabs.map((tabPath) => {
              const file = files[tabPath]
              if (!file) return null
              const isActive = activeTab === tabPath
              return (
                <div
                  key={tabPath}
                  onClick={() => openFile(tabPath)}
                  className={`group flex items-center gap-2 h-full px-4 border-r border-[#E6E2D8] dark:border-[#30363d] text-xs font-medium cursor-pointer transition-colors relative shrink-0 ${
                    isActive
                      ? 'bg-[#FCFAF7] dark:bg-[#0d1117] text-[#2D312E] dark:text-[#e6edf3]'
                      : 'text-[#5B625E] dark:text-[#8b949e] hover:bg-[#EBE7DD] dark:hover:bg-white/5'
                  }`}
                >
                  {/* Active Indicator line */}
                  {isActive && (
                    <div className={`absolute top-0 left-0 right-0 h-0.5 ${theme === 'zen' ? 'bg-[#869D7A]' : 'bg-[#58a6ff]'}`} />
                  )}
                  
                  <span className="truncate max-w-[120px]">{file.name}</span>
                  
                  {/* Modified Indicator or Close tab */}
                  <div className="w-3.5 h-3.5 flex items-center justify-center relative">
                    {file.isModified ? (
                      <div className="w-1.5 h-1.5 rounded-full bg-[#A89EC9] dark:bg-[#a371f7]" />
                    ) : null}
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        closeFile(tabPath)
                      }}
                      className="absolute inset-0 items-center justify-center hidden group-hover:flex rounded hover:bg-black/10 dark:hover:bg-white/10 text-[#5B625E] dark:text-[#8b949e] hover:text-[#2D312E] dark:hover:text-[#e6edf3]"
                    >
                      <X size={10} />
                    </button>
                  </div>
                </div>
              )
            })}
          </div>

          {/* Save Button */}
          {activeFile && (
            <div className="flex items-center px-3 border-l border-[#E6E2D8] dark:border-[#30363d] h-full shrink-0">
              <button
                onClick={() => saveFile(activeFile.path)}
                disabled={!activeFile.isModified}
                className={`flex items-center gap-1 px-2.5 py-1 rounded-md text-[10px] font-bold transition-all ${
                  activeFile.isModified
                    ? 'bg-[#869D7A] hover:bg-[#869D7A]/95 text-white shadow-sm'
                    : 'bg-transparent text-[#8A8F8B] border border-[#E6E2D8] dark:border-[#30363d] cursor-not-allowed'
                }`}
                title="Save changes (Ctrl+S)"
              >
                <Save size={11} />
                <span>Save</span>
              </button>
            </div>
          )}
        </div>
      )}

      {/* Editor Frame */}
      {activeFile ? (
        <div className="flex-1 w-full overflow-hidden relative">
          <Editor
            height="100%"
            path={activeFile.path}
            language={getLanguage(activeFile.path)}
            value={activeFile.content}
            onChange={(val) => updateFileContent(activeFile.path, val || '')}
            beforeMount={handleEditorWillMount}
            onMount={handleEditorMount}
            theme={editorTheme}
            options={{
              fontSize: 13,
              fontFamily: "'JetBrains Mono', Courier, monospace",
              minimap: { enabled: false },
              automaticLayout: true,
              wordWrap: 'on',
              lineNumbersMinChars: 3,
              tabSize: 2,
              scrollBeyondLastLine: false,
              cursorBlinking: 'smooth',
              cursorSmoothCaretAnimation: 'on',
              smoothScrolling: true,
            }}
          />
        </div>
      ) : (
        /* Empty State */
        <div className="flex-1 flex flex-col items-center justify-center p-6 text-center select-none bg-[#FCFAF7] dark:bg-[#0d1117] text-[#5B625E] dark:text-[#8b949e]">
          <div className="w-16 h-16 rounded-2xl bg-[#F5F2EB] dark:bg-[#161b22] border border-[#E6E2D8] dark:border-[#30363d] flex items-center justify-center text-[#869D7A] mb-6 shadow-sm">
            <Zap size={28} className="animate-pulse" />
          </div>
          <h3 className="font-extrabold text-[#2D312E] dark:text-[#e6edf3] text-lg mb-2">No Open Documents</h3>
          <p className="text-xs max-w-xs leading-normal mb-8">
            Double click a file in the File Explorer sidebar to open it, or ask the AI Workspace Assistant to forge some code for you.
          </p>

          <div className="space-y-3 font-mono text-[10px] text-left max-w-sm w-full p-4 bg-[#F5F2EB]/50 dark:bg-[#161b22]/50 border border-[#E6E2D8] dark:border-[#30363d] rounded-2xl">
            <div className="flex items-center justify-between">
              <span className="text-[#8A8F8B]">Open File:</span>
              <span className="font-semibold">Double-click in Explorer</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-[#8A8F8B]">Generate components:</span>
              <span className="font-semibold">"Create a Navbar" in Chat</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-[#8A8F8B]">Workspace language:</span>
              <span className="font-semibold uppercase text-[#869D7A]">{projectType} template</span>
            </div>
          </div>
        </div>
      )}

      {/* ─── Bottom Interactive Terminal Drawer ─── */}
      <div className="border-t border-[#E6E2D8] dark:border-[#30363d] bg-[#F5F2EB] dark:bg-[#161b22] flex flex-col shrink-0">
        
        {/* Terminal Header Bar */}
        <div className="h-8 px-3 flex items-center justify-between select-none text-xs border-b border-[#E6E2D8]/50 dark:border-[#30363d]/50">
          
          {/* Tabs & Status */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                setTerminalOpen(true)
                setTerminalTab('all')
              }}
              className={`flex items-center gap-1.5 px-2 py-0.5 rounded text-[11px] font-medium transition-all ${
                terminalOpen && terminalTab === 'all'
                  ? 'bg-white dark:bg-[#0d1117] text-[#869D7A] font-bold shadow-sm'
                  : 'text-[#5B625E] dark:text-[#8b949e] hover:text-[#2D312E] dark:hover:text-[#e6edf3]'
              }`}
            >
              <TerminalIcon size={12} />
              <span>Terminal ({compilerLogs.length})</span>
            </button>

            <button
              onClick={() => {
                setTerminalOpen(true)
                setTerminalTab('errors')
              }}
              className={`flex items-center gap-1.5 px-2 py-0.5 rounded text-[11px] font-medium transition-all ${
                terminalOpen && terminalTab === 'errors'
                  ? 'bg-white dark:bg-[#0d1117] text-red-500 font-bold shadow-sm'
                  : 'text-[#5B625E] dark:text-[#8b949e] hover:text-[#2D312E] dark:hover:text-[#e6edf3]'
              }`}
            >
              <AlertCircle size={12} className={compilerLogs.some(l => l.includes('[ERR') || l.includes('[Error')) ? 'text-red-500' : ''} />
              <span>Errors ({compilerLogs.filter(l => l.includes('[ERR') || l.includes('[Error')).length})</span>
            </button>

            <div className="h-3 w-[1px] bg-[#E6E2D8] dark:bg-[#30363d] mx-1" />

            <div className="flex items-center gap-1 text-[10px] text-[#869D7A] font-semibold">
              <span className="w-1.5 h-1.5 rounded-full bg-[#869D7A] animate-pulse" />
              <span>Sandbox Active</span>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-1">
            {terminalOpen && (
              <>
                <button
                  onClick={handleCopyLogs}
                  title="Copy log contents"
                  className="p-1 rounded hover:bg-white dark:hover:bg-[#0d1117] text-[#5B625E] dark:text-[#8b949e] hover:text-[#2D312E] transition-all"
                >
                  {copied ? <Check size={12} className="text-[#869D7A]" /> : <Copy size={12} />}
                </button>
                <button
                  onClick={clearCompilerLogs}
                  title="Clear output terminal"
                  className="p-1 rounded hover:bg-white dark:hover:bg-[#0d1117] text-[#5B625E] dark:text-[#8b949e] hover:text-red-500 transition-all"
                >
                  <Trash2 size={12} />
                </button>
              </>
            )}
            <button
              onClick={() => setTerminalOpen(!terminalOpen)}
              title={terminalOpen ? 'Collapse terminal' : 'Expand terminal'}
              className="p-1 rounded hover:bg-white dark:hover:bg-[#0d1117] text-[#5B625E] dark:text-[#8b949e] hover:text-[#2D312E] transition-all"
            >
              {terminalOpen ? <ChevronDown size={14} /> : <ChevronUp size={14} />}
            </button>
          </div>

        </div>

        {/* Terminal Logs Content Drawer */}
        {terminalOpen && (
          <div className="h-44 p-3 bg-[#0d1117] text-xs font-mono overflow-y-auto space-y-1 select-text scrollbar-thin">
            {compilerLogs.length > 0 ? (
              compilerLogs
                .filter(log => terminalTab === 'all' || log.includes('[ERR') || log.includes('[Error'))
                .map((log, i) => {
                  let colorClass = 'text-[#e6edf3]'
                  if (log.includes('[Error') || log.includes('[ERR')) colorClass = 'text-red-400 font-semibold'
                  else if (log.includes('[ForgePilot]') || log.includes('[Sandbox]')) colorClass = 'text-[#869D7A]'
                  else if (log.includes('[Compiler]')) colorClass = 'text-[#A89EC9]'
                  else if (log.includes('[Saved]') || log.includes('[Export]')) colorClass = 'text-amber-300'

                  return (
                    <div key={i} className={`leading-relaxed break-all ${colorClass}`}>
                      <span className="text-[#484f58] select-none mr-2">›</span>
                      {log}
                    </div>
                  )
                })
            ) : (
              <div className="text-[#484f58] italic py-2">Terminal ready. Execution logs and errors will stream here live.</div>
            )}
            <div ref={terminalEndRef} />
          </div>
        )}

      </div>

    </div>
  )
}
