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
    gradient: 'from-[#D4A373] to-[#F2D2BD]',
    glow: 'rgba(212, 163, 115, 0.08)',
  },
  {
    icon: <Code2 size={22} />,
    title: 'Full Monaco Editor',
    description:
      'The exact same editor powering VS Code, embedded in your browser. Full syntax highlighting, multi-tab support, and auto-save baked in.',
    gradient: 'from-[#869D7A] to-[#A8C3A0]',
    glow: 'rgba(134, 157, 122, 0.08)',
  },
  {
    icon: <Folder size={22} />,
    title: 'Smart File Explorer',
    description:
      'AI auto-creates and organizes your project files into a live tree. Right-click to rename, delete, or create new files and folders instantly.',
    gradient: 'from-[#88B2AC] to-[#AEC6CF]',
    glow: 'rgba(136, 178, 172, 0.08)',
  },
  {
    icon: <Activity size={22} />,
    title: 'Real-time Streaming',
    description:
      "Watch the AI think and write code token by token. You see every character as the AI generates it — no waiting for the full response to land.",
    gradient: 'from-[#A89EC9] to-[#C6BDE2]',
    glow: 'rgba(168, 158, 201, 0.08)',
  },
  {
    icon: <Lightbulb size={22} />,
    title: 'Extended AI Thinking',
    description:
      "Powered by modern deep reasoning capabilities. The AI reasons before generating code, catching edge cases and producing superior quality every time.",
    gradient: 'from-[#E8A598] to-[#F3D2C1]',
    glow: 'rgba(232, 165, 152, 0.08)',
  },
  {
    icon: <MessageSquare size={22} />,
    title: 'Context-Aware Chat',
    description:
      "Every message carries your entire project context. ForgePilot knows your file tree and active file, so it always gives relevant, accurate help.",
    gradient: 'from-[#869D7A] to-[#A89EC9]',
    glow: 'rgba(134, 157, 122, 0.08)',
  },
]

const FeatureCard = ({ feature }: { feature: Feature }) => (
  <div
    className="feature-card group relative bg-[#F5F2EB] border border-[#E6E2D8] rounded-2xl p-6 cursor-default"
    style={{ '--card-glow': feature.glow } as React.CSSProperties}
  >
    {/* Icon */}
    <div
      className={`w-12 h-12 rounded-xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center text-white mb-5 shadow-sm group-hover:scale-110 transition-transform duration-300`}
    >
      {feature.icon}
    </div>

    {/* Title */}
    <h3 className="text-base font-semibold text-[#2D312E] mb-2">{feature.title}</h3>

    {/* Description */}
    <p className="text-sm text-[#5B625E] leading-relaxed">{feature.description}</p>

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
    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-px h-32 bg-gradient-to-b from-transparent via-[#E6E2D8] to-transparent" />

    <div className="max-w-7xl mx-auto px-6">
      {/* Header */}
      <div className="text-center mb-16">
        <span className="inline-block px-3 py-1 text-xs font-semibold text-[#869D7A] bg-[#869D7A]/10 border border-[#869D7A]/20 rounded-full mb-4 uppercase tracking-widest">
          Features
        </span>
        <h2 className="text-4xl md:text-5xl font-extrabold text-[#2D312E] mb-4 tracking-tight">
          Everything you need to build fast
        </h2>
        <p className="max-w-xl mx-auto text-lg text-[#5B625E]">
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
