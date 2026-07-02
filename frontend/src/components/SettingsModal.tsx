import React from 'react'
import { useWorkspace } from '../context/WorkspaceContext'
import { X, Key, ShieldAlert, Cpu, Sparkles, Sun, Moon } from 'lucide-react'

interface SettingsModalProps {
  isOpen: boolean
  onClose: () => void
}

export default function SettingsModal({ isOpen, onClose }: SettingsModalProps) {
  const { llmConfig, setLlmConfig, theme, setTheme } = useWorkspace()

  if (!isOpen) return null

  const handleProviderChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setLlmConfig({
      ...llmConfig,
      provider: e.target.value as 'simulated' | 'gemini',
    })
  }

  const handleModelChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setLlmConfig({
      ...llmConfig,
      model: e.target.value,
    })
  }

  const handleKeyChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLlmConfig({
      ...llmConfig,
      apiKey: e.target.value.trim(),
    })
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#2D312E]/40 backdrop-blur-sm animate-fade-in">
      <div className="w-full max-w-lg bg-[#FAF8F5] border border-[#E6E2D8] rounded-3xl shadow-xl overflow-hidden animate-slide-up">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#E6E2D8] bg-[#F5F2EB]">
          <div className="flex items-center gap-2 font-bold text-[#2D312E] text-base">
            <Cpu size={18} className="text-[#869D7A]" />
            <span>Workspace Settings</span>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-[#5B625E] hover:text-[#2D312E] hover:bg-black/5 transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6 text-left max-h-[80vh] overflow-y-auto">
          
          {/* Theme Switcher */}
          <div className="space-y-2">
            <span className="text-xs font-bold text-[#5B625E] uppercase tracking-wider block">
              Workspace Aesthetic
            </span>
            <div className="grid grid-cols-2 gap-3">
              <div
                onClick={() => setTheme('zen')}
                className={`p-3 rounded-xl border flex items-center gap-2.5 cursor-pointer transition-all ${
                  theme === 'zen'
                    ? 'border-[#869D7A] bg-[#869D7A]/5 text-[#788E6E] font-medium'
                    : 'border-[#E6E2D8] bg-white text-[#5B625E] hover:border-[#869D7A]/50'
                }`}
              >
                <Sun size={16} />
                <span className="text-sm">Zen Mode</span>
              </div>
              <div
                onClick={() => setTheme('midnight')}
                className={`p-3 rounded-xl border flex items-center gap-2.5 cursor-pointer transition-all ${
                  theme === 'midnight'
                    ? 'border-[#A89EC9] bg-[#A89EC9]/5 text-[#7A61A0] font-medium'
                    : 'border-[#E6E2D8] bg-white text-[#5B625E] hover:border-[#A89EC9]/50'
                }`}
              >
                <Moon size={16} />
                <span className="text-sm">Midnight</span>
              </div>
            </div>
          </div>

          <hr className="border-[#E6E2D8]" />

          {/* Provider Select */}
          <div className="space-y-2">
            <label htmlFor="llm-provider" className="text-xs font-bold text-[#5B625E] uppercase tracking-wider block">
              AI Engine Mode
            </label>
            <select
              id="llm-provider"
              value={llmConfig.provider}
              onChange={handleProviderChange}
              className="w-full px-3 py-2.5 bg-white border border-[#E6E2D8] rounded-xl text-sm text-[#2D312E] focus:outline-none focus:border-[#869D7A] transition-colors"
            >
              <option value="simulated">Simulated Assistant (Local Presets)</option>
              <option value="gemini">Gemini API (Online / Live Generation)</option>
            </select>
          </div>

          {llmConfig.provider === 'simulated' ? (
            <div className="p-4 bg-[#869D7A]/10 border border-[#869D7A]/20 rounded-2xl flex gap-3 text-left">
              <Sparkles size={18} className="text-[#869D7A] shrink-0 mt-0.5" />
              <div className="text-xs text-[#5B625E] leading-relaxed">
                <span className="font-semibold text-[#2D312E] block mb-0.5">Offline Simulated Mode</span>
                Generate standard components like **Navbar**, **TodoList**, and **CardGrid** instantly. Change provider to **Gemini API** for fully custom prompts!
              </div>
            </div>
          ) : (
            <div className="space-y-4 animate-slide-up">
              
              {/* API Key */}
              <div className="space-y-2">
                <label htmlFor="api-key" className="text-xs font-bold text-[#5B625E] uppercase tracking-wider flex items-center gap-1.5">
                  <Key size={12} />
                  Gemini API Key
                </label>
                <input
                  type="password"
                  id="api-key"
                  value={llmConfig.apiKey}
                  onChange={handleKeyChange}
                  placeholder="Paste AIzaSy... key here"
                  className="w-full px-3 py-2.5 bg-white border border-[#E6E2D8] rounded-xl text-[#2D312E] text-sm focus:outline-none focus:border-[#869D7A] transition-colors shadow-inner"
                />
                <p className="text-[10px] text-[#8A8F8B] leading-relaxed">
                  Your key is stored 100% locally in your browser's LocalStorage and is sent directly to Google APIs.
                </p>
              </div>

              {/* Model Select */}
              <div className="space-y-2">
                <label htmlFor="llm-model" className="text-xs font-bold text-[#5B625E] uppercase tracking-wider block">
                  Model Variant
                </label>
                <select
                  id="llm-model"
                  value={llmConfig.model}
                  onChange={handleModelChange}
                  className="w-full px-3 py-2.5 bg-white border border-[#E6E2D8] rounded-xl text-sm text-[#2D312E] focus:outline-none focus:border-[#869D7A] transition-colors"
                >
                  <option value="gemini-1.5-flash">Gemini 1.5 Flash (Super Fast)</option>
                  <option value="gemini-1.5-pro">Gemini 1.5 Pro (Highly Intelligent)</option>
                  <option value="gemini-2.5-flash">Gemini 2.5 Flash</option>
                  <option value="gemini-2.0-flash">Gemini 2.0 Flash</option>
                </select>
              </div>

              <div className="p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-2xl flex gap-3 text-left">
                <ShieldAlert size={18} className="text-yellow-600 shrink-0 mt-0.5" />
                <div className="text-xs text-[#5B625E] leading-relaxed">
                  Make sure your key has active credits and has access to the chosen model. Check details at Google AI Studio.
                </div>
              </div>

            </div>
          )}

        </div>

        {/* Footer */}
        <div className="flex justify-end gap-3 px-6 py-4 border-t border-[#E6E2D8] bg-[#F5F2EB]">
          <button
            onClick={onClose}
            className="px-5 py-2.5 bg-[#869D7A] hover:bg-[#869D7A]/95 text-white font-semibold rounded-xl text-sm transition-all shadow-sm"
          >
            Apply Changes
          </button>
        </div>

      </div>
    </div>
  )
}
