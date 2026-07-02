import { useState, useRef, useEffect } from 'react'
import { useWorkspace } from '../context/WorkspaceContext'
import { Sparkles, Send, User, FileCheck } from 'lucide-react'

export default function AiPanel() {
  const { chatHistory, sendMessage, isGenerating } = useWorkspace()
  const [input, setInput] = useState('')
  const chatEndRef = useRef<HTMLDivElement>(null)

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim() || isGenerating) return
    sendMessage(input.trim())
    setInput('')
  }

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [chatHistory])

  // Custom inline Markdown parser
  const renderMessageText = (text: string) => {
    if (!text) return null
    
    // Parse alert blocks
    const alertRegex = /> \[!(TIP|NOTE|IMPORTANT|WARNING)\]\n> (.*)/g
    let processed = text.replace(alertRegex, (_, type, content) => {
      const colors = {
        TIP: 'bg-[#869D7A]/10 border-[#869D7A]/40 text-[#788E6E]',
        NOTE: 'bg-[#A89EC9]/10 border-[#A89EC9]/40 text-[#7A61A0]',
        IMPORTANT: 'bg-orange-500/10 border-orange-500/40 text-orange-600',
        WARNING: 'bg-red-500/10 border-red-500/40 text-red-600'
      }[type as 'TIP' | 'NOTE' | 'IMPORTANT' | 'WARNING'] || 'bg-gray-100 border-gray-300'

      return `<div class="p-3 my-2 border rounded-xl text-[11px] ${colors} leading-relaxed font-sans">
        <strong>${type}:</strong> ${content}
      </div>`
    })

    // Parse Headers
    processed = processed.replace(/^### (.*$)/gim, '<h3 class="text-sm font-bold text-[#2D312E] dark:text-white mt-3 mb-1">$1</h3>')
    processed = processed.replace(/^## (.*$)/gim, '<h2 class="text-base font-extrabold text-[#2D312E] dark:text-white mt-4 mb-2">$1</h2>')

    // Parse Bold
    processed = processed.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    
    // Parse Bullets
    processed = processed.replace(/^\* (.*$)/gim, '<li class="ml-4 list-disc text-[11px] leading-relaxed">$1</li>')

    // Parse Inline code
    processed = processed.replace(/`(.*?)`/g, '<code class="px-1.5 py-0.5 rounded bg-black/5 dark:bg-white/5 font-mono text-[10px] text-[#9B4F4F]">$1</code>')

    // Break lines
    processed = processed.replace(/\n/g, '<br />')

    return <div dangerouslySetInnerHTML={{ __html: processed }} className="space-y-1 text-[11px] leading-relaxed" />
  }

  // Detect and render code blocks / action updates separately if needed
  const renderMessageContent = (message: any) => {
    // Check if message has structural JSON actions (implied or parsed)
    const hasWorkspaceActions = message.text.includes('```json-workspace-action')

    return (
      <div className="space-y-3">
        {renderMessageText(message.text)}

        {hasWorkspaceActions && (
          <div className="p-3 bg-[#FAF8F5] dark:bg-[#0d1117] border border-[#869D7A]/30 rounded-2xl flex items-start gap-2.5 shadow-sm text-left animate-pulse mt-2">
            <FileCheck size={16} className="text-[#869D7A] shrink-0 mt-0.5" />
            <div className="text-[10px]">
              <span className="font-bold text-[#2D312E] dark:text-[#e6edf3] block mb-0.5">Workspace Files Synced</span>
              <p className="text-[#5B625E] dark:text-[#8b949e]">
                ForgePilot automatically generated files in the explorer tree and synced them in Monaco Editor.
              </p>
            </div>
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="flex-1 flex flex-col overflow-hidden bg-[#FAF8F5] dark:bg-[#0d1117] border-l border-[#E6E2D8] dark:border-[#30363d]">
      
      {/* Pane Title Bar */}
      <div className="px-4 py-2 border-b border-[#E6E2D8] dark:border-[#30363d] bg-[#F5F2EB] dark:bg-[#161b22] flex items-center gap-1.5 shrink-0 select-none">
        <div className={`w-2 h-2 rounded-full ${isGenerating ? 'bg-[#869D7A] animate-ping' : 'bg-[#B2B8B3]'}`} />
        <span className="text-[10px] font-bold text-[#5B625E] dark:text-[#8b949e] uppercase tracking-wider">
          AI Copilot Panel
        </span>
      </div>

      {/* Chat Messages Logs */}
      <div className="flex-1 p-4 overflow-y-auto space-y-4 font-sans text-left">
        {chatHistory.map((message) => {
          const isUser = message.sender === 'user'
          return (
            <div
              key={message.id}
              className={`flex items-start gap-2.5 max-w-[85%] ${
                isUser ? 'ml-auto flex-row-reverse' : 'mr-auto'
              }`}
            >
              {/* Avatar circle */}
              <div
                className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 text-[10px] font-bold shadow-sm ${
                  isUser
                    ? 'bg-[#E6E2D8] dark:bg-[#30363d] text-[#2D312E] dark:text-[#e6edf3]'
                    : 'bg-gradient-to-br from-[#869D7A] to-[#A89EC9] text-white'
                }`}
              >
                {isUser ? <User size={12} /> : 'AI'}
              </div>

              {/* Message Bubble box */}
              <div
                className={`p-3.5 rounded-2xl border text-[#2D312E] dark:text-[#e6edf3] shadow-sm leading-relaxed ${
                  isUser
                    ? 'bg-[#A89EC9]/10 dark:bg-[#58a6ff]/10 border-[#A89EC9]/20 dark:border-[#58a6ff]/20 rounded-tr-none'
                    : 'bg-[#F5F2EB] dark:bg-[#161b22] border-[#E6E2D8] dark:border-[#30363d] rounded-tl-none'
                }`}
              >
                {/* Header info */}
                <div className="flex items-center gap-1.5 mb-1.5 select-none">
                  <span
                    className={`text-[9px] font-bold uppercase tracking-wider ${
                      isUser ? 'text-[#7A61A0]' : 'text-[#788E6E]'
                    }`}
                  >
                    {isUser ? 'You' : 'ForgePilot AI'}
                  </span>
                  <span className="text-[8px] text-[#8A8F8B]">
                    {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>

                {/* Content */}
                {message.isPending ? (
                  <div className="flex items-center gap-2 text-[#A89EC9] py-1">
                    <Sparkles size={11} className="animate-spin" />
                    <span className="text-[10px] font-medium font-mono">Forging code...</span>
                    <div className="flex gap-1 ml-1">
                      <div className="w-1.5 h-1.5 rounded-full bg-[#A89EC9] animate-bounce" style={{ animationDelay: '0ms' }} />
                      <div className="w-1.5 h-1.5 rounded-full bg-[#A89EC9] animate-bounce" style={{ animationDelay: '160ms' }} />
                      <div className="w-1.5 h-1.5 rounded-full bg-[#A89EC9] animate-bounce" style={{ animationDelay: '320ms' }} />
                    </div>
                  </div>
                ) : (
                  renderMessageContent(message)
                )}
              </div>
            </div>
          )
        })}
        <div ref={chatEndRef} />
      </div>

      {/* Input panel row */}
      <form onSubmit={handleSend} className="border-t border-[#E6E2D8] dark:border-[#30363d] p-3 shrink-0 bg-[#F5F2EB] dark:bg-[#161b22] select-none">
        <div className="flex items-center bg-[#FCFAF7] dark:bg-[#0d1117] border border-[#E6E2D8] dark:border-[#30363d] rounded-xl px-3 py-2 gap-2 shadow-inner focus-within:border-[#869D7A] transition-all">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={isGenerating}
            placeholder={isGenerating ? 'Please wait...' : 'Ask ForgePilot to build components...'}
            className="flex-1 bg-transparent text-xs text-[#2D312E] dark:text-[#e6edf3] focus:outline-none disabled:opacity-50 font-sans"
          />
          <button
            type="submit"
            disabled={!input.trim() || isGenerating}
            className="p-1.5 rounded-lg bg-[#869D7A] hover:bg-[#869D7A]/95 text-white disabled:opacity-30 disabled:bg-gray-400 transition-all shadow-sm flex items-center justify-center"
          >
            <Send size={12} />
          </button>
        </div>
      </form>

    </div>
  )
}
