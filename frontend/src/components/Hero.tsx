import { ArrowRight, Github, Sparkles } from 'lucide-react'

/* ── Syntax-highlighted code line helpers ── */
const K = ({ c }: { c: string }) => <span className="text-[#9B4F4F] font-semibold">{c}</span>       // keyword
const S = ({ c }: { c: string }) => <span className="text-[#4F7B9B]">{c}</span>       // string
const F = ({ c }: { c: string }) => <span className="text-[#7A61A0]">{c}</span>       // function/type
const T = ({ c }: { c: string }) => <span className="text-[#4A8F53]">{c}</span>       // jsx tag
const P = ({ c }: { c: string }) => <span className="text-[#6FA2C4]">{c}</span>       // prop/attr
const Cm = ({ c }: { c: string }) => <span className="text-[#8A8F8B] italic">{c}</span> // comment
const Plain = ({ c }: { c: string }) => <span className="text-[#2D312E]">{c}</span>   // plain

const Ln = ({ n, children }: { n: number; children: React.ReactNode }) => (
  <div className="flex leading-5">
    <span className="w-7 text-right mr-4 text-[#B2B8B3] select-none shrink-0 text-[10px]">{n}</span>
    <span className="text-[10px] font-mono">{children}</span>
  </div>
)

/* ── IDE Mockup ── */
const IDEMockup = () => (
  <div className="relative animate-float">
    {/* Ambient glow behind the window */}
    <div className="absolute -inset-4 bg-gradient-to-r from-[#869D7A]/10 via-[#A89EC9]/10 to-[#D4A373]/5 rounded-3xl blur-3xl" />

    {/* Window frame */}
    <div className="relative ide-window rounded-2xl border border-[#E6E2D8]/80 bg-[#FAF8F5] overflow-hidden">

      {/* Title bar */}
      <div className="flex items-center gap-2 px-4 h-9 bg-[#F5F2EB] border-b border-[#E6E2D8]/80">
        <div className="flex gap-1.5">
          <div className="w-3 h-3 rounded-full bg-[#ff5f57] hover:brightness-110 transition-all" />
          <div className="w-3 h-3 rounded-full bg-[#ffbd2e] hover:brightness-110 transition-all" />
          <div className="w-3 h-3 rounded-full bg-[#28c840] hover:brightness-110 transition-all" />
        </div>
        <span className="flex-1 text-center text-[11px] text-[#5B625E] select-none">
          ForgePilot — my-react-app
        </span>
      </div>

      {/* Three-panel layout */}
      <div className="flex h-[340px] md:h-[380px]">

        {/* ── Left: File Explorer ── */}
        <div className="hidden sm:flex w-44 border-r border-[#E6E2D8]/80 bg-[#F5F2EB] flex-col shrink-0">
          <div className="px-3 py-2 text-[9px] font-semibold text-[#5B625E] uppercase tracking-widest border-b border-[#E6E2D8]/60">
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
                    ? 'bg-[#869D7A]/15 text-[#788E6E]'
                    : 'text-[#5B625E]'
                }`}
                style={{ paddingLeft: `${4 + item.indent * 10}px` }}
              >
                <span className="text-[8px]">{item.icon}</span>
                <span>{item.label}</span>
                {item.active && (
                  <span className="ml-auto text-[#A89EC9] text-[8px]">●</span>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* ── Center: Code Editor ── */}
        <div className="flex-1 flex flex-col overflow-hidden bg-[#FAF8F5]">
          {/* Tab bar */}
          <div className="flex items-center h-8 bg-[#F5F2EB] border-b border-[#E6E2D8]/80 shrink-0">
            <div className="flex items-center gap-1.5 px-4 h-full bg-[#FAF8F5] border-r border-[#E6E2D8]/80 text-[10px] text-[#2D312E] font-medium">
              <span className="text-[#869D7A] text-[8px]">●</span>
              <span>Navbar.tsx</span>
              <span className="text-[#5B625E] hover:text-[#2D312E] cursor-pointer ml-1 text-[11px]">×</span>
            </div>
          </div>

          {/* Code */}
          <div className="flex-1 p-3 overflow-hidden bg-[#FAF8F5]">
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
        <div className="hidden md:flex w-64 border-l border-[#E6E2D8]/80 bg-[#FAF8F5] flex-col shrink-0">
          {/* Chat header */}
          <div className="flex items-center gap-2 px-3 h-8 border-b border-[#E6E2D8]/80 bg-[#F5F2EB] shrink-0">
            <div className="w-2 h-2 rounded-full bg-[#869D7A] animate-pulse" />
            <span className="text-[10px] text-[#2D312E] font-semibold">ForgePilot AI</span>
          </div>

          {/* Messages */}
          <div className="flex-1 p-3 space-y-3 overflow-hidden">
            {/* AI response */}
            <div className="bg-[#F5F2EB] border border-[#E6E2D8] rounded-xl p-3 text-[10px]">
              <div className="flex items-center gap-1.5 mb-2">
                <div className="w-4 h-4 rounded-full bg-gradient-to-br from-[#869D7A] to-[#A89EC9] flex items-center justify-center text-[7px] text-white font-bold shrink-0">
                  AI
                </div>
                <span className="text-[#869D7A] font-semibold">ForgePilot</span>
              </div>
              <p className="text-[#2D312E] leading-4">
                Here's your Navbar! I've added fixed positioning with backdrop blur and a responsive hamburger menu.
              </p>
            </div>

            {/* User message */}
            <div className="bg-[#A89EC9]/10 border border-[#A89EC9]/20 rounded-xl p-3 text-[10px]">
              <div className="flex items-center gap-1.5 mb-2">
                <div className="w-4 h-4 rounded-full bg-[#E6E2D8] flex items-center justify-center text-[7px] text-[#2D312E] font-bold shrink-0">
                  U
                </div>
                <span className="text-[#5B625E] font-semibold">You</span>
              </div>
              <p className="text-[#2D312E] leading-4">Add a mobile hamburger menu</p>
            </div>

            {/* AI generating */}
            <div className="bg-[#F5F2EB] border border-[#E6E2D8] rounded-xl p-3 text-[10px]">
              <div className="flex items-center gap-1.5 mb-2">
                <div className="w-4 h-4 rounded-full bg-gradient-to-br from-[#869D7A] to-[#A89EC9] flex items-center justify-center text-[7px] text-white font-bold shrink-0">
                  AI
                </div>
                <span className="text-[#869D7A] font-semibold">ForgePilot</span>
              </div>
              <div className="flex items-center gap-2 text-[#A89EC9]">
                <Sparkles size={10} />
                <span>Generating</span>
                <div className="flex gap-1 ml-1">
                  <div className="w-1 h-1 rounded-full bg-[#A89EC9] animate-bounce" style={{ animationDelay: '0ms' }} />
                  <div className="w-1 h-1 rounded-full bg-[#A89EC9] animate-bounce" style={{ animationDelay: '160ms' }} />
                  <div className="w-1 h-1 rounded-full bg-[#A89EC9] animate-bounce" style={{ animationDelay: '320ms' }} />
                </div>
              </div>
            </div>
          </div>

          {/* Input */}
          <div className="border-t border-[#E6E2D8]/80 p-2 shrink-0 bg-[#F5F2EB]">
            <div className="flex items-center bg-[#FAF8F5] border border-[#E6E2D8] rounded-lg px-3 py-2 text-[10px] text-[#5B625E] gap-2">
              <span className="flex-1">Ask ForgePilot...</span>
              <ArrowRight size={10} className="text-[#5B625E]" />
            </div>
          </div>
        </div>
      </div>

      {/* Status bar */}
      <div className="flex items-center justify-between px-4 h-5 bg-gradient-to-r from-[#869D7A] to-[#A89EC9] text-white text-[9px] font-medium">
        <span>✓ TypeScript · ESLint</span>
        <span>Navbar.tsx</span>
        <span>UTF-8 · Ln 19, Col 1</span>
      </div>
    </div>
  </div>
)

/* ── Hero Section ── */
const Hero = ({ onStartBuilding }: { onStartBuilding: () => void }) => (
  <section
    id="hero"
    className="relative min-h-screen flex flex-col items-center justify-center pt-24 pb-20 overflow-hidden dot-grid"
  >
    {/* Ambient gradient blobs */}
    <div className="absolute top-0 left-0 w-[700px] h-[700px] bg-[#869D7A]/5 rounded-full blur-[120px] -translate-x-1/3 -translate-y-1/3 pointer-events-none" />
    <div className="absolute top-1/3 right-0 w-[600px] h-[600px] bg-[#A89EC9]/5 rounded-full blur-[120px] translate-x-1/3 pointer-events-none" />
    <div className="absolute bottom-0 left-1/2 w-[500px] h-[300px] bg-[#D4A373]/3 rounded-full blur-[100px] -translate-x-1/2 translate-y-1/2 pointer-events-none" />

    <div className="max-w-7xl mx-auto px-6 text-center relative z-10">

      {/* Badge */}
      <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[#E6E2D8] bg-[#F5F2EB]/80 backdrop-blur-sm mb-8 text-sm text-[#5B625E]">
        <Sparkles size={13} className="text-[#A89EC9]" />
        <span>Powered by Gemini 2.5 Flash</span>
        <span className="w-1 h-1 rounded-full bg-[#869D7A] animate-pulse" />
      </div>

      {/* Headline */}
      <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-black tracking-tight leading-[1.05] mb-6">
        <span className="text-[#2D312E]">Forge Code at the</span>
        <br />
        <span className="gradient-text">Speed of Thought</span>
      </h1>

      {/* Subtitle */}
      <p className="max-w-2xl mx-auto text-lg md:text-xl text-[#5B625E] mb-10 leading-relaxed">
        ForgePilot is an AI-powered developer workspace. Describe what you need and watch it{' '}
        <span className="text-[#2D312E] font-medium">generate files</span>,{' '}
        <span className="text-[#2D312E] font-medium">write code</span>, and{' '}
        <span className="text-[#2D312E] font-medium">organize your project</span> — automatically.
      </p>

      {/* CTA Buttons */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
        <button
          id="hero-cta-primary"
          onClick={onStartBuilding}
          className="btn-primary w-full sm:w-auto px-8 py-4 rounded-xl font-semibold text-white bg-gradient-to-r from-[#869D7A] to-[#A89EC9] hover:opacity-90 transition-all duration-200 flex items-center justify-center gap-2 shadow-md shadow-[#869D7A]/15 text-base"
        >
          Start Building Free
          <ArrowRight size={18} />
        </button>
        <a
          id="hero-cta-github"
          href="https://github.com"
          target="_blank"
          rel="noreferrer"
          className="w-full sm:w-auto px-8 py-4 rounded-xl font-semibold text-[#2D312E] border border-[#E6E2D8] hover:border-[#869D7A]/50 hover:bg-[#869D7A]/5 transition-all duration-200 flex items-center justify-center gap-2 text-base"
        >
          <Github size={18} />
          View on GitHub
        </a>
      </div>

      {/* Social proof pill */}
      <p className="text-sm text-[#5B625E] mb-16">
        <span className="text-[#869D7A]">●</span> Free to use · No sign-up required · Open source
      </p>

      {/* IDE Mockup */}
      <IDEMockup />
    </div>
  </section>
)

export default Hero
