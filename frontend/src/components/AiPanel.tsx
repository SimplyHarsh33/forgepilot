import { useState, useRef, useEffect } from 'react'
import { useWorkspace } from '../context/WorkspaceContext'
import { Sparkles, Send, User, FileCheck, Copy, Check, Key, ExternalLink, Eye, EyeOff, ChevronRight, ShieldCheck, Zap } from 'lucide-react'

// Custom Markdown parser for code fences
interface MarkdownBlock {
  type: 'text' | 'code'
  language: string
  content: string
}

const parseMarkdown = (text: string): MarkdownBlock[] => {
  if (!text) return []

  const parts: MarkdownBlock[] = []
  const codeRegex = /```(\w*)\n([\s\S]*?)```/g
  let lastIndex = 0
  let match

  while ((match = codeRegex.exec(text)) !== null) {
    const index = match.index
    const language = match[1] || 'plaintext'
    const code = match[2]

    // Add preceding text block
    if (index > lastIndex) {
      parts.push({
        type: 'text',
        language: '',
        content: text.substring(lastIndex, index)
      })
    }

    // Add code block
    parts.push({
      type: 'code',
      language,
      content: code
    })

    lastIndex = codeRegex.lastIndex
  }

  // Add trailing text block
  if (lastIndex < text.length) {
    parts.push({
      type: 'text',
      language: '',
      content: text.substring(lastIndex)
    })
  }

  return parts
}

// ─── Inline API Key Setup Panel ───────────────────────────────────────────────
function ApiKeySetupPanel() {
  const { llmConfig, setLlmConfig } = useWorkspace()
  const [keyInput, setKeyInput] = useState(llmConfig.apiKey || '')
  const [showKey, setShowKey] = useState(false)
  const [saved, setSaved] = useState(false)
  const [mode, setMode] = useState<'gemini' | 'simulated'>(llmConfig.provider)

  const handleSave = () => {
    setLlmConfig({
      ...llmConfig,
      provider: 'gemini',
      apiKey: keyInput.trim(),
    })
    setSaved(true)
    setTimeout(() => setSaved(false), 2500)
  }

  const handleSimulated = () => {
    setMode('simulated')
    setLlmConfig({ ...llmConfig, provider: 'simulated' })
  }

  return (
    <div className="flex-1 flex flex-col items-center justify-center p-6 bg-[#FAF8F5] dark:bg-[#0d1117] overflow-y-auto">
      
      {/* Hero Icon */}
      <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#869D7A] to-[#A89EC9] flex items-center justify-center shadow-lg mb-5 animate-pulse-slow">
        <Zap size={28} className="text-white" fill="white" />
      </div>

      <h2 className="text-base font-extrabold text-[#2D312E] dark:text-white mb-1 text-center">
        Connect AI to ForgePilot
      </h2>
      <p className="text-[11px] text-[#5B625E] dark:text-[#8b949e] text-center max-w-xs leading-relaxed mb-6">
        Paste your free <span className="font-semibold text-[#869D7A]">Google Gemini API key</span> below to unlock real AI code generation.
      </p>

      {/* Step cards */}
      <div className="w-full max-w-xs space-y-2 mb-6">
        {[
          { step: '1', text: 'Go to aistudio.google.com', sub: 'Sign in with your Google account', href: 'https://aistudio.google.com/app/apikey' },
          { step: '2', text: 'Click "Create API Key"', sub: 'Select "Create API key in new project"', href: null },
          { step: '3', text: 'Copy & paste below', sub: 'Your key starts with AIzaSy...', href: null },
        ].map(({ step, text, sub, href }) => (
          <div key={step} className="flex items-start gap-3 p-3 bg-white dark:bg-[#161b22] border border-[#E6E2D8] dark:border-[#30363d] rounded-xl">
            <div className="w-5 h-5 rounded-full bg-gradient-to-br from-[#869D7A] to-[#A89EC9] flex items-center justify-center text-white text-[9px] font-black shrink-0 mt-0.5">
              {step}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[11px] font-semibold text-[#2D312E] dark:text-[#e6edf3]">{text}</p>
              <p className="text-[10px] text-[#8A8F8B] leading-relaxed">{sub}</p>
            </div>
            {href && (
              <a
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className="p-1 rounded-lg hover:bg-[#869D7A]/10 text-[#869D7A] transition-colors shrink-0"
                title="Open Google AI Studio"
              >
                <ExternalLink size={12} />
              </a>
            )}
          </div>
        ))}
      </div>

      {/* Key Input */}
      <div className="w-full max-w-xs space-y-2 mb-3">
        <label className="text-[10px] font-bold text-[#5B625E] dark:text-[#8b949e] uppercase tracking-wider flex items-center gap-1.5">
          <Key size={10} />
          Your Gemini API Key
        </label>
        <div className="flex items-center bg-white dark:bg-[#161b22] border border-[#E6E2D8] dark:border-[#30363d] rounded-xl px-3 py-2.5 gap-2 focus-within:border-[#869D7A] transition-all shadow-sm">
          <input
            type={showKey ? 'text' : 'password'}
            value={keyInput}
            onChange={(e) => setKeyInput(e.target.value)}
            placeholder="AIzaSy..."
            className="flex-1 bg-transparent text-xs text-[#2D312E] dark:text-[#e6edf3] focus:outline-none font-mono placeholder:font-sans placeholder:text-[#B2B8B3]"
            onKeyDown={(e) => e.key === 'Enter' && keyInput.trim() && handleSave()}
          />
          <button
            type="button"
            onClick={() => setShowKey(!showKey)}
            className="text-[#B2B8B3] hover:text-[#5B625E] dark:hover:text-[#8b949e] transition-colors"
          >
            {showKey ? <EyeOff size={13} /> : <Eye size={13} />}
          </button>
        </div>
        <p className="text-[10px] text-[#8A8F8B] flex items-center gap-1">
          <ShieldCheck size={10} className="text-[#869D7A]" />
          Stored locally in your browser — never sent to our servers.
        </p>
      </div>

      {/* Save Button */}
      <button
        onClick={handleSave}
        disabled={!keyInput.trim()}
        className={`w-full max-w-xs py-2.5 rounded-xl text-sm font-bold transition-all shadow-sm flex items-center justify-center gap-2 mb-3 ${
          saved
            ? 'bg-[#869D7A] text-white'
            : keyInput.trim()
            ? 'bg-gradient-to-r from-[#869D7A] to-[#A89EC9] text-white hover:opacity-90'
            : 'bg-[#E6E2D8] dark:bg-[#30363d] text-[#B2B8B3] cursor-not-allowed'
        }`}
      >
        {saved ? (
          <><Check size={14} /> Key Saved — AI Ready!</>
        ) : (
          <><ChevronRight size={14} /> Activate Gemini AI</>
        )}
      </button>

      {/* Divider */}
      <div className="flex items-center gap-3 w-full max-w-xs mb-3">
        <div className="flex-1 h-px bg-[#E6E2D8] dark:bg-[#30363d]" />
        <span className="text-[10px] text-[#B2B8B3]">or</span>
        <div className="flex-1 h-px bg-[#E6E2D8] dark:bg-[#30363d]" />
      </div>

      {/* Simulated mode fallback */}
      <button
        onClick={handleSimulated}
        className="w-full max-w-xs py-2 rounded-xl text-xs font-semibold border border-[#E6E2D8] dark:border-[#30363d] text-[#5B625E] dark:text-[#8b949e] hover:border-[#869D7A]/40 hover:text-[#2D312E] dark:hover:text-[#e6edf3] transition-all"
      >
        Continue with Simulated Mode (offline presets)
      </button>

      <p className="text-[9px] text-[#B2B8B3] text-center mt-4 max-w-xs leading-relaxed">
        Free tier: 1,500 requests/day · No credit card needed
      </p>
    </div>
  )
}

// ─── Main AiPanel Component ────────────────────────────────────────────────────
export default function AiPanel() {
  const { chatHistory, sendMessage, isGenerating, llmConfig, setLlmConfig } = useWorkspace()
  const [input, setInput] = useState('')
  const [copiedBlockId, setCopiedBlockId] = useState<string | null>(null)
  const chatEndRef = useRef<HTMLDivElement>(null)

  // Show setup panel if:
  // - provider is gemini but no key set
  // - provider is neither set (fresh state)
  const needsApiKeySetup =
    llmConfig.provider === 'gemini' && !llmConfig.apiKey.trim()

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim() || isGenerating) return
    sendMessage(input.trim())
    setInput('')
  }

  const handleCopyCode = (code: string, blockId: string) => {
    navigator.clipboard.writeText(code)
    setCopiedBlockId(blockId)
    setTimeout(() => setCopiedBlockId(null), 2000)
  }

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [chatHistory])

  // Custom inline Markdown parser for text blocks
  const renderTextWithInlineMarkdown = (text: string) => {
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
    const hasWorkspaceActions = message.text.includes('```json-workspace-action')
    const blocks = parseMarkdown(message.text)

    return (
      <div className="space-y-3">
        {blocks.map((block, idx) => {
          if (block.type === 'code') {
            // Hide workspace action payload from the user chat message directly
            if (block.language === 'json-workspace-action') {
              return null
            }

            const blockId = `${message.id}-${idx}`
            const isCopied = copiedBlockId === blockId

            return (
              <div key={blockId} className="my-3 overflow-hidden rounded-xl border border-[#E6E2D8] dark:border-[#30363d]">
                {/* Header bar */}
                <div className="flex items-center justify-between px-4 py-1.5 bg-[#EBE7DD] dark:bg-[#161b22] text-[#5B625E] dark:text-[#8b949e] border-b border-[#E6E2D8] dark:border-[#30363d] text-[10px] font-mono select-none font-bold">
                  <span className="uppercase">{block.language}</span>
                  <button
                    type="button"
                    onClick={() => handleCopyCode(block.content, blockId)}
                    className="flex items-center gap-1 hover:text-[#2D312E] dark:hover:text-[#e6edf3] transition-colors"
                  >
                    {isCopied ? (
                      <>
                        <Check size={11} className="text-[#869D7A]" />
                        <span className="text-[#869D7A]">Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy size={11} />
                        <span>Copy code</span>
                      </>
                    )}
                  </button>
                </div>
                {/* Code pre */}
                <pre className="p-3.5 overflow-x-auto bg-[#FCFAF7] dark:bg-[#0d1117] text-[#2D312E] dark:text-[#e6edf3] font-mono text-[10px] leading-relaxed select-text scrollbar-thin">
                  <code>{block.content}</code>
                </pre>
              </div>
            )
          }

          // Render text block with inline markdown
          return (
            <div key={idx}>
              {renderTextWithInlineMarkdown(block.content.trim())}
            </div>
          )
        })}

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
      <div className="px-4 py-2 border-b border-[#E6E2D8] dark:border-[#30363d] bg-[#F5F2EB] dark:bg-[#161b22] flex items-center justify-between shrink-0 select-none">
        <div className="flex items-center gap-1.5">
          <div className={`w-2 h-2 rounded-full ${isGenerating ? 'bg-[#869D7A] animate-ping' : needsApiKeySetup ? 'bg-amber-400' : 'bg-[#B2B8B3]'}`} />
          <span className="text-[10px] font-bold text-[#5B625E] dark:text-[#8b949e] uppercase tracking-wider">
            AI Copilot Panel
          </span>
        </div>

        {/* Quick mode badge */}
        <div className="flex items-center gap-1.5">
          <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold ${
            llmConfig.provider === 'gemini' && llmConfig.apiKey
              ? 'bg-[#869D7A]/15 text-[#788E6E]'
              : llmConfig.provider === 'simulated'
              ? 'bg-[#A89EC9]/15 text-[#7A61A0]'
              : 'bg-amber-400/15 text-amber-600'
          }`}>
            {llmConfig.provider === 'gemini' && llmConfig.apiKey
              ? `⚡ Gemini · ${llmConfig.model}`
              : llmConfig.provider === 'simulated'
              ? '🧩 Simulated'
              : '⚠ Key needed'}
          </span>
          {/* If using gemini with key, show a small clear/change key button */}
          {llmConfig.provider === 'gemini' && llmConfig.apiKey && (
            <button
              onClick={() => setLlmConfig({ ...llmConfig, apiKey: '' })}
              title="Change API key"
              className="p-1 rounded-lg hover:bg-black/5 dark:hover:bg-white/5 text-[#B2B8B3] hover:text-[#5B625E] transition-colors"
            >
              <Key size={10} />
            </button>
          )}
        </div>
      </div>

      {/* Conditional: Show API setup panel OR chat */}
      {needsApiKeySetup ? (
        <ApiKeySetupPanel />
      ) : (
        <>
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
        </>
      )}
    </div>
  )
}
