import { FolderPlus, MessageCircle, Sparkles } from 'lucide-react'
import type { ReactNode } from 'react'

interface Step {
  number: string
  title: string
  description: string
  icon: ReactNode
  color: string
  borderColor: string
}

const steps: Step[] = [
  {
    number: '01',
    title: 'Create a Project',
    description:
      'Start a new workspace in seconds. Give your project a name and you\'re instantly ready to build — no config, no setup.',
    icon: <FolderPlus size={26} />,
    color: 'from-[#58a6ff] to-[#79c0ff]',
    borderColor: 'rgba(88, 166, 255, 0.3)',
  },
  {
    number: '02',
    title: 'Describe What You Need',
    description:
      'Type in plain English. "Create a Navbar", "Add a login form", "Refactor this function to use async/await". No commands to memorize.',
    icon: <MessageCircle size={26} />,
    color: 'from-[#a371f7] to-[#d2a8ff]',
    borderColor: 'rgba(163, 113, 247, 0.3)',
  },
  {
    number: '03',
    title: 'Watch It Build',
    description:
      'ForgePilot generates the files, writes the code, and opens everything in the editor — automatically. Your project grows in real time.',
    icon: <Sparkles size={26} />,
    color: 'from-[#3fb950] to-[#7ee787]',
    borderColor: 'rgba(63, 185, 80, 0.3)',
  },
]

const HowItWorks = () => (
  <section id="how-it-works" className="py-28 relative overflow-hidden">
    {/* Background accent */}
    <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#161b22]/40 to-transparent pointer-events-none" />

    <div className="max-w-7xl mx-auto px-6 relative z-10">
      {/* Header */}
      <div className="text-center mb-20">
        <span className="inline-block px-3 py-1 text-xs font-semibold text-[#a371f7] bg-[#a371f7]/10 border border-[#a371f7]/20 rounded-full mb-4 uppercase tracking-widest">
          How It Works
        </span>
        <h2 className="text-4xl md:text-5xl font-extrabold text-[#e6edf3] mb-4 tracking-tight">
          Three steps to ship faster
        </h2>
        <p className="max-w-lg mx-auto text-lg text-[#8b949e]">
          ForgePilot removes the friction between your idea and working code.
        </p>
      </div>

      {/* Steps */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
        {/* Connecting line (desktop only) */}
        <div className="hidden md:block absolute top-12 left-[calc(16.67%+2rem)] right-[calc(16.67%+2rem)] h-px">
          <div className="h-full bg-gradient-to-r from-[#58a6ff]/40 via-[#a371f7]/40 to-[#3fb950]/40" />
          <div className="absolute top-1/2 left-1/4 -translate-y-1/2 -translate-x-1/2 w-2 h-2 rounded-full bg-[#a371f7]/60" />
          <div className="absolute top-1/2 right-1/4 -translate-y-1/2 translate-x-1/2 w-2 h-2 rounded-full bg-[#a371f7]/60" />
        </div>

        {steps.map((step, idx) => (
          <div key={step.number} className="flex flex-col items-center text-center group">
            {/* Step icon circle */}
            <div className="relative mb-6">
              {/* Glow ring */}
              <div
                className="absolute inset-0 rounded-full blur-xl scale-150 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                style={{ background: `linear-gradient(135deg, ${step.borderColor}, transparent)` }}
              />
              <div
                className={`relative w-24 h-24 rounded-full bg-gradient-to-br ${step.color} flex items-center justify-center text-white shadow-2xl group-hover:scale-105 transition-transform duration-300`}
                style={{ boxShadow: `0 0 40px ${step.borderColor}` }}
              >
                {step.icon}
              </div>
              {/* Step number badge */}
              <div className="absolute -top-1 -right-1 w-7 h-7 rounded-full bg-[#0d1117] border border-[#30363d] flex items-center justify-center">
                <span className="text-[10px] font-bold text-[#8b949e]">{step.number}</span>
              </div>
            </div>

            {/* Text */}
            <h3 className="text-xl font-bold text-[#e6edf3] mb-3">{step.title}</h3>
            <p className="text-sm text-[#8b949e] leading-relaxed max-w-xs">{step.description}</p>

            {/* Mobile arrow (between steps) */}
            {idx < steps.length - 1 && (
              <div className="md:hidden mt-8 text-[#30363d] text-2xl">↓</div>
            )}
          </div>
        ))}
      </div>
    </div>
  </section>
)

export default HowItWorks
