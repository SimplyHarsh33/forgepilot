import { useRef } from 'react'
import Editor, { Monaco } from '@monaco-editor/react'
import { useWorkspace } from '../context/WorkspaceContext'
import { Zap, X } from 'lucide-react'

export default function CodeEditor() {
  const { 
    files, openTabs, activeTab, updateFileContent, openFile, closeFile, theme, projectType 
  } = useWorkspace()

  const editorRef = useRef<any>(null)

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

  const handleEditorMount = (editor: any, monaco: Monaco) => {
    editorRef.current = editor
  }

  // Update theme inside Monaco dynamically
  const editorTheme = theme === 'zen' ? 'pastelZen' : 'cyberMidnight'

  return (
    <div className="flex-1 flex flex-col overflow-hidden bg-[#FCFAF7] dark:bg-[#0d1117]">
      
      {/* Tabs Row Bar */}
      {openTabs.length > 0 && (
        <div className="flex items-center h-9 border-b border-[#E6E2D8] dark:border-[#30363d] bg-[#F5F2EB] dark:bg-[#161b22] overflow-x-auto shrink-0 select-none scrollbar-none">
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
                  {file.isModified && !isActive ? (
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

    </div>
  )
}
