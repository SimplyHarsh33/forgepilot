import { ArrowRight, Github, Sparkles } from 'lucide-react'

/* ── Syntax-highlighted code line helpers ── */
const K = ({ c }: { c: string }) => <span className="text-[#ff7b72]">{c}</span>       // keyword
const S = ({ c }: { c: string }) => <span className="text-[#a5d6ff]">{c}</span>       // string
const F = ({ c }: { c: string }) => <span className="text-[#d2a8ff]">{c}</span>       // function/type
const T = ({ c }: { c: string }) => <span className="text-[#7ee787]">{c}</span>       // jsx tag
const P = ({ c }: { c: string }) => <span className="text-[#79c0ff]">{c}</span>       // prop/attr
const Cm = ({ c }: { c: string }) => <span className="text-[#8b949e] italic">{c}</span> // comment
const Plain = ({ c }: { c: string }) => <span className="text-[#e6edf3]">{c}</span>   // plain

const Ln = ({ n, children }: { n: number; children: React.ReactNode }) => (
  <div className="flex leading-5">
    <span className="w-7 text-right mr-4 text-[#3d444d] select-none shrink-0 text-[10px]">{n}</span>
    <span className="text-[10px] font-mono">{children}</span>
  </div>
)

/* ── IDE Mockup ── */
const IDEMockup = () => (
  <div className="relative animate-float">
    {/* Ambient glow behind the window */}
    <div className="absolute -inset-4 bg-gradient-to-r from-[#58a6ff]/15 via-[#a371f7]/15 to-[#f0883e]/10 rounded-3xl blur-3xl" />

    {/* Window frame */}
    <div className="relative ide-window rounded-2xl border border-[#30363d]/80 bg-[#161b22] overflow-hidden">

      {/* Title bar */}
      <div className="flex items-center gap-2 px-4 h-9 bg-[#0d1117] border-b border-[#30363d]/80">
        <div className="flex gap-1.5">
          <div className="w-3 h-3 rounded-full bg-[#ff5f57] hover:brightness-110 transition-all" />
          <div className="w-3 h-3 rounded-full bg-[#ffbd2e] hover:brightness-110 transition-all" />
          <div className="w-3 h-3 rounded-full bg-[#28c840] hover:brightness-110 transition-all" />
        </div>
        <span className="flex-1 text-center text-[11px] text-[#8b949e] select-none">
          ForgePilot — my-react-app
        </span>
      </div>

      {/* Three-panel layout */}
      <div className="flex h-[340px] md:h-[380px]">

        {/* ── Left: File Explorer ── */}
        <div className="hidden sm:flex w-44 border-r border-[#30363d]/80 flex-col shrink-0">
          <div className="px-3 py-2 text-[9px] font-semibold text-[#8b949e] uppercase tracking-widest border-b border-[#30363d]/60">
            Explorer
          </div>
          <div className="p-2 space-y-px text-[10px] font-mono overflow-hidden">
            {[
              { indent: 0, icon: '▾', label: 'SRC', muted: true },
              { indent: 1, icon: '▾', label: 'components', muted: true },
              { indent: 2, icon: '●', label: 'Navbar.tsx', active: true },
              { indent: 2, icon: '◦', label: 'Hero.tsx', muted: true },
              { indent: 2, icon: '◦', label: 'Features.tsx', muted: true },
              { indent: 2, icon: '◦', label: 'Footer.tsx', muted: true },
              { indent: 1, icon: '◦', label: 'App.tsx', muted: true },
              { indent: 1, icon: '◦', label: 'index.css', muted: true },
              { indent: 0, icon: '▾', label: 'PUBLIC', muted: true },
              { indent: 1, icon: '◦', label: 'index.html', muted: true },
              { indent: 0, icon: '◦', label: 'package.json', muted: true },
            ].map((item, i) => (
              <div
                key={i}
                className={`flex items-center gap-1 px-1 py-0.5 rounded-sm ${
                  item.active
                    ? 'bg-[#58a6ff]/15 text-[#58a6ff]'
                    : 'text-[#8b949e]'
                }`}
                style={{ paddingLeft: `${4 + item.indent * 10}px` }}
              >
                <span className="text-[8px]">{item.icon}</span>
                <span>{item.label}</span>
                {item.active && (
                  <span className="ml-auto text-[#a371f7] text-[8px]">●</span>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* ── Center: Code Editor ── */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Tab bar */}
          <div className="flex items-center h-8 bg-[#0d1117]/70 border-b border-[#30363d]/80 shrink-0">
            <div className="flex items-center gap-1.5 px-4 h-full bg-[#161b22] border-r border-[#30363d]/80 text-[10px] text-[#e6edf3]">
              <span className="text-[#3fb950] text-[8px]">●</span>
              <span>Navbar.tsx</span>
              <span className="text-[#8b949e] hover:text-[#e6edf3] cursor-pointer ml-1 text-[11px]">×</span>
            </div>
          </div>

          {/* Code */}
          <div className="flex-1 p-3 overflow-hidden bg-[#0d1117]/30">
            <Ln n={1}><K c="import" /> <Plain c="React, " /><Plain c="{ " /><F c="useState" /><Plain c=" } " /><K c="from" /> <S c="'react'" /></Ln>
            <Ln n={2}><K c="import" /> <Plain c="{ " /><F c="Zap, Menu, X" /><Plain c=" } " /><K c="from" /> <S c="'lucide-react'" /></Ln>
            <Ln n={3}><Plain c="" /></Ln>
            <Ln n={4}><Cm c="// Auto-generated by ForgePilot ✦" /></Ln>
            <Ln n={5}><K c="const" /> <F c="Navbar" /><Plain c=" = () => " /><Plain c="{" /></Ln>
            <Ln n={6}><Plain c="  " /><K c="const" /><Plain c=" [open, setOpen] = " /><F c="useState" /><Plain c="(false)" /></Ln>
            <Ln n={7}><Plain c="" /></Ln>
            <Ln n={8}><Plain c="  " /><K c="return" /><Plain c=" (" /></Ln>
            <Ln n={9}><Plain c="    " /><T c="<nav" /> <P c="className" /><Plain c={`="`} /><S c="fixed top-0 w-full" /><Plain c={`"`} /><T c=">" /></Ln>
            <Ln n={10}><Plain c="      " /><T c="<div" /> <P c="className" /><Plain c={`="`} /><S c="flex items-center h-16" /><Plain c={`"`} /><T c=">" /></Ln>
            <Ln n={11}><Plain c="        " /><T c="<span" /> <P c="className" /><Plain c={`="`} /><S c="font-bold text-white" /><Plain c={`"`} /><T c=">" /></Ln>
            <Ln n={12}><Plain c="          ForgePilot" /></Ln>
            <Ln n={13}><Plain c="        " /><T c="</span>" /></Ln>
            <Ln n={14}><Plain c="      " /><T c="</div>" /></Ln>
            <Ln n={15}><Plain c="    " /><T c="</nav>" /></Ln>
            <Ln n={16}><Plain c="  )" /></Ln>
            <Ln n={17}><Plain c="}" /></Ln>
            <Ln n={18}><Plain c="" /></Ln>
            <Ln n={19}><K c="export" /> <K c="default" /> <F c="Navbar" /></Ln>
          </div>
        </div>

        {/* ── Right: AI Chat Panel ── */}
        <div className="hidden md:flex w-64 border-l border-[#30363d]/80 flex-col shrink-0">
          {/* Chat header */}
          <div className="flex items-center gap-2 px-3 h-8 border-b border-[#30363d]/80 bg-[#0d1117]/70 shrink-0">
            <div className="w-2 h-2 rounded-full bg-[#3fb950] animate-pulse" />
            <span className="text-[10px] text-[#e6edf3] font-semibold">ForgePilot AI</span>
          </div>

          {/* Messages */}
          <div className="flex-1 p-3 space-y-3 overflow-hidden">
            {/* AI response */}
            <div className="bg-[#21262d] rounded-xl p-3 text-[10px]">
              <div className="flex items-center gap-1.5 mb-2">
                <div className="w-4 h-4 rounded-full bg-gradient-to-br from-[#58a6ff] to-[#a371f7] flex items-center justify-center text-[7px] text-white font-bold shrink-0">
                  AI
                </div>
                <span className="text-[#58a6ff] font-semibold">ForgePilot</span>
              </div>
              <p className="text-[#c9d1d9] leading-4">
                Here's your Navbar! I've added fixed positioning with backdrop blur and a responsive hamburger menu.
              </p>
            </div>

            {/* User message */}
            <div className="bg-[#58a6ff]/10 border border-[#58a6ff]/20 rounded-xl p-3 text-[10px]">
              <div className="flex items-center gap-1.5 mb-2">
                <div className="w-4 h-4 rounded-full bg-[#30363d] flex items-center justify-center text-[7px] text-[#e6edf3] font-bold shrink-0">
                  U
                </div>
                <span className="text-[#8b949e] font-semibold">You</span>
              </div>
              <p className="text-[#e6edf3] leading-4">Add a mobile hamburger menu</p>
            </div>

            {/* AI generating */}
            <div className="bg-[#21262d] rounded-xl p-3 text-[10px]">
              <div className="flex items-center gap-1.5 mb-2">
                <div className="w-4 h-4 rounded-full bg-gradient-to-br from-[#58a6ff] to-[#a371f7] flex items-center justify-center text-[7px] text-white font-bold shrink-0">
                  AI
                </div>
                <span className="text-[#58a6ff] font-semibold">ForgePilot</span>
              </div>
              <div className="flex items-center gap-2 text-[#a371f7]">
                <Sparkles size={10} />
                <span>Generating</span>
                <div className="flex gap-1 ml-1">
                  <div className="w-1 h-1 rounded-full bg-[#a371f7] animate-bounce" style={{ animationDelay: '0ms' }} />
                  <div className="w-1 h-1 rounded-full bg-[#a371f7] animate-bounce" style={{ animationDelay: '160ms' }} />
                  <div className="w-1 h-1 rounded-full bg-[#a371f7] animate-bounce" style={{ animationDelay: '320ms' }} />
                </div>
              </div>
            </div>
          </div>

          {/* Input */}
          <div className="border-t border-[#30363d]/80 p-2 shrink-0">
            <div className="flex items-center bg-[#21262d] rounded-lg px-3 py-2 text-[10px] text-[#8b949e] gap-2">
              <span className="flex-1">Ask ForgePilot...</span>
              <ArrowRight size={10} className="text-[#30363d]" />
            </div>
          </div>
        </div>
      </div>

      {/* Status bar */}
      <div className="flex items-center justify-between px-4 h-5 bg-gradient-to-r from-[#58a6ff] to-[#a371f7] text-white text-[9px] font-medium">
        <span>✓ TypeScript · ESLint</span>
        <span>Navbar.tsx</span>
        <span>UTF-8 · Ln 19, Col 1</span>
      </div>
    </div>
  </div>
)

/* ── Hero Section ── */
const Hero = () => (
  <section
    id="hero"
    className="relative min-h-screen flex flex-col items-center justify-center pt-24 pb-20 overflow-hidden dot-grid"
  >
    {/* Ambient gradient blobs */}
    <div className="absolute top-0 left-0 w-[700px] h-[700px] bg-[#58a6ff]/6 rounded-full blur-[120px] -translate-x-1/3 -translate-y-1/3 pointer-events-none" />
    <div className="absolute top-1/3 right-0 w-[600px] h-[600px] bg-[#a371f7]/6 rounded-full blur-[120px] translate-x-1/3 pointer-events-none" />
    <div className="absolute bottom-0 left-1/2 w-[500px] h-[300px] bg-[#f0883e]/4 rounded-full blur-[100px] -translate-x-1/2 translate-y-1/2 pointer-events-none" />

    <div className="max-w-7xl mx-auto px-6 text-center relative z-10">

      {/* Badge */}
      <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[#30363d] bg-[#161b22]/80 backdrop-blur-sm mb-8 text-sm text-[#8b949e]">
        <Sparkles size={13} className="text-[#a371f7]" />
        <span>Powered by Claude Extended Thinking</span>
        <span className="w-1 h-1 rounded-full bg-[#3fb950] animate-pulse" />
      </div>

      {/* Headline */}
      <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-black tracking-tight leading-[1.05] mb-6">
        <span className="text-[#e6edf3]">Forge Code at the</span>
        <br />
        <span className="gradient-text">Speed of Thought</span>
      </h1>

      {/* Subtitle */}
      <p className="max-w-2xl mx-auto text-lg md:text-xl text-[#8b949e] mb-10 leading-relaxed">
        ForgePilot is an AI-powered developer workspace. Describe what you need and watch it{' '}
        <span className="text-[#e6edf3]">generate files</span>,{' '}
        <span className="text-[#e6edf3]">write code</span>, and{' '}
        <span className="text-[#e6edf3]">organize your project</span> — automatically.
      </p>

      {/* CTA Buttons */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
        <button
          id="hero-cta-primary"
          className="btn-primary w-full sm:w-auto px-8 py-4 rounded-xl font-semibold text-white bg-gradient-to-r from-[#58a6ff] to-[#a371f7] hover:opacity-90 transition-all duration-200 flex items-center justify-center gap-2 shadow-lg shadow-[#58a6ff]/20 text-base"
        >
          Start Building Free
          <ArrowRight size={18} />
        </button>
        <a
          id="hero-cta-github"
          href="https://github.com"
          target="_blank"
          rel="noreferrer"
          className="w-full sm:w-auto px-8 py-4 rounded-xl font-semibold text-[#e6edf3] border border-[#30363d] hover:border-[#58a6ff]/50 hover:bg-[#58a6ff]/5 transition-all duration-200 flex items-center justify-center gap-2 text-base"
        >
          <Github size={18} />
          View on GitHub
        </a>
      </div>

      {/* Social proof pill */}
      <p className="text-sm text-[#8b949e] mb-16">
        <span className="text-[#3fb950]">●</span> Free to use · No sign-up required · Open source
      </p>

      {/* IDE Mockup */}
      <IDEMockup />
    </div>
  </section>
)

export default Hero
