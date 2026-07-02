import { Zap, Code2, Folder, Activity, Lightbulb, MessageSquare } from 'lucide-react'
import type { ReactNode } from 'react'

interface Feature {
  icon: ReactNode
  title: string
  description: string
  gradient: string
  glow: string
}

const features: Feature[] = [
  {
    icon: <Zap size={22} />,
    title: 'Instant Code Generation',
    description:
      'Describe what you need in plain English. ForgePilot generates production-ready code and creates the files automatically — no templates, no boilerplate.',
    gradient: 'from-[#f0883e] to-[#f2cc60]',
    glow: 'rgba(240, 136, 62, 0.15)',
  },
  {
    icon: <Code2 size={22} />,
    title: 'Full Monaco Editor',
    description:
      'The exact same editor powering VS Code, embedded in your browser. Full syntax highlighting, multi-tab support, and auto-save baked in.',
    gradient: 'from-[#58a6ff] to-[#79c0ff]',
    glow: 'rgba(88, 166, 255, 0.15)',
  },
  {
    icon: <Folder size={22} />,
    title: 'Smart File Explorer',
    description:
      'AI auto-creates and organizes your project files into a live tree. Right-click to rename, delete, or create new files and folders instantly.',
    gradient: 'from-[#3fb950] to-[#7ee787]',
    glow: 'rgba(63, 185, 80, 0.15)',
  },
  {
    icon: <Activity size={22} />,
    title: 'Real-time Streaming',
    description:
      "Watch Claude think and write code token by token. You see every character as the AI generates it — no waiting for the full response to land.",
    gradient: 'from-[#a371f7] to-[#d2a8ff]',
    glow: 'rgba(163, 113, 247, 0.15)',
  },
  {
    icon: <Lightbulb size={22} />,
    title: 'Extended AI Thinking',
    description:
      "Powered by Claude's extended thinking mode. The AI reasons deeply before generating code, catching edge cases and producing superior quality every time.",
    gradient: 'from-[#ff7b72] to-[#f0883e]',
    glow: 'rgba(255, 123, 114, 0.15)',
  },
  {
    icon: <MessageSquare size={22} />,
    title: 'Context-Aware Chat',
    description:
      "Every message carries your entire project context. ForgePilot knows your file tree and active file, so it always gives relevant, accurate help.",
    gradient: 'from-[#58a6ff] to-[#a371f7]',
    glow: 'rgba(88, 166, 255, 0.15)',
  },
]

const FeatureCard = ({ feature }: { feature: Feature }) => (
  <div
    className="feature-card group relative bg-[#161b22] border border-[#30363d] rounded-2xl p-6 cursor-default"
    style={{ '--card-glow': feature.glow } as React.CSSProperties}
  >
    {/* Icon */}
    <div
      className={`w-12 h-12 rounded-xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center text-white mb-5 shadow-lg group-hover:scale-110 transition-transform duration-300`}
    >
      {feature.icon}
    </div>

    {/* Title */}
    <h3 className="text-base font-semibold text-[#e6edf3] mb-2">{feature.title}</h3>

    {/* Description */}
    <p className="text-sm text-[#8b949e] leading-relaxed">{feature.description}</p>

    {/* Hover gradient border overlay */}
    <div
      className={`absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none`}
      style={{
        background: `radial-gradient(circle at 50% 0%, ${feature.glow}, transparent 70%)`,
      }}
    />
  </div>
)

const Features = () => (
  <section id="features" className="py-28 relative overflow-hidden">
    {/* Subtle section divider glow */}
    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-px h-32 bg-gradient-to-b from-transparent via-[#30363d] to-transparent" />

    <div className="max-w-7xl mx-auto px-6">
      {/* Header */}
      <div className="text-center mb-16">
        <span className="inline-block px-3 py-1 text-xs font-semibold text-[#58a6ff] bg-[#58a6ff]/10 border border-[#58a6ff]/20 rounded-full mb-4 uppercase tracking-widest">
          Features
        </span>
        <h2 className="text-4xl md:text-5xl font-extrabold text-[#e6edf3] mb-4 tracking-tight">
          Everything you need to build fast
        </h2>
        <p className="max-w-xl mx-auto text-lg text-[#8b949e]">
          A complete AI-powered workspace — not just a chatbot. ForgePilot handles the whole loop from idea to working code.
        </p>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {features.map((feature) => (
          <FeatureCard key={feature.title} feature={feature} />
        ))}
      </div>
    </div>
  </section>
)

export default Features
