import { ArrowRight, Sparkles } from 'lucide-react'

const CTASection = () => (
  <section id="cta" className="py-28 relative overflow-hidden">
    {/* Full-bleed gradient background */}
    <div className="absolute inset-0 bg-gradient-to-br from-[#58a6ff]/8 via-[#a371f7]/8 to-[#f0883e]/6 pointer-events-none" />
    <div className="absolute inset-0 dot-grid opacity-40 pointer-events-none" />

    {/* Corner blobs */}
    <div className="absolute top-0 left-0 w-[400px] h-[400px] bg-[#58a6ff]/10 rounded-full blur-[100px] -translate-x-1/2 -translate-y-1/2 pointer-events-none" />
    <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-[#a371f7]/10 rounded-full blur-[100px] translate-x-1/2 translate-y-1/2 pointer-events-none" />

    <div className="max-w-4xl mx-auto px-6 text-center relative z-10">
      {/* Icon */}
      <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-[#58a6ff] to-[#a371f7] mb-8 shadow-2xl shadow-[#58a6ff]/30">
        <Sparkles size={28} className="text-white" />
      </div>

      {/* Headline */}
      <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-[#e6edf3] mb-5 tracking-tight leading-tight">
        Ready to build at{' '}
        <span className="gradient-text">AI speed?</span>
      </h2>

      {/* Subtitle */}
      <p className="text-lg md:text-xl text-[#8b949e] mb-10 max-w-xl mx-auto leading-relaxed">
        Join developers forging their next project with ForgePilot. Free to start, no sign-up required.
      </p>

      {/* CTA Button */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
        <button
          id="cta-start"
          className="btn-primary w-full sm:w-auto px-10 py-4 rounded-xl text-base font-semibold text-white bg-gradient-to-r from-[#58a6ff] to-[#a371f7] hover:opacity-90 transition-all duration-200 flex items-center justify-center gap-2 shadow-xl shadow-[#58a6ff]/25"
        >
          Start Building Free
          <ArrowRight size={18} />
        </button>
        <button
          id="cta-demo"
          className="w-full sm:w-auto px-10 py-4 rounded-xl text-base font-semibold text-[#8b949e] border border-[#30363d] hover:border-[#58a6ff]/50 hover:text-[#e6edf3] hover:bg-[#58a6ff]/5 transition-all duration-200"
        >
          View Demo
        </button>
      </div>

      {/* Trust badges */}
      <div className="flex flex-wrap items-center justify-center gap-6 mt-12 text-sm text-[#8b949e]">
        {[
          { icon: '🔒', label: 'No account needed' },
          { icon: '⚡', label: 'Instant setup' },
          { icon: '🌍', label: 'Open source' },
        ].map(({ icon, label }) => (
          <div key={label} className="flex items-center gap-2">
            <span>{icon}</span>
            <span>{label}</span>
          </div>
        ))}
      </div>
    </div>
  </section>
)

export default CTASection
