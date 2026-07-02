import { ArrowRight, Sparkles } from 'lucide-react'

const CTASection = ({ onStartBuilding }: { onStartBuilding: () => void }) => (
  <section id="cta" className="py-28 relative overflow-hidden">
    {/* Full-bleed gradient background */}
    <div className="absolute inset-0 bg-gradient-to-br from-[#869D7A]/5 via-[#A89EC9]/5 to-[#D4A373]/3 pointer-events-none" />
    <div className="absolute inset-0 dot-grid opacity-40 pointer-events-none" />

    {/* Corner blobs */}
    <div className="absolute top-0 left-0 w-[400px] h-[400px] bg-[#869D7A]/5 rounded-full blur-[100px] -translate-x-1/2 -translate-y-1/2 pointer-events-none" />
    <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-[#A89EC9]/5 rounded-full blur-[100px] translate-x-1/2 translate-y-1/2 pointer-events-none" />

    <div className="max-w-4xl mx-auto px-6 text-center relative z-10">
      {/* Icon */}
      <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-[#869D7A] to-[#A89EC9] mb-8 shadow-md shadow-[#869D7A]/15">
        <Sparkles size={28} className="text-white" />
      </div>

      {/* Headline */}
      <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-[#2D312E] mb-5 tracking-tight leading-tight">
        Ready to build at{' '}
        <span className="gradient-text">AI speed?</span>
      </h2>

      {/* Subtitle */}
      <p className="text-lg md:text-xl text-[#5B625E] mb-10 max-w-xl mx-auto leading-relaxed">
        Join developers forging their next project with ForgePilot. Free to start, no sign-up required.
      </p>

      {/* CTA Button */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
        <button
          id="cta-start"
          onClick={onStartBuilding}
          className="btn-primary w-full sm:w-auto px-10 py-4 rounded-xl text-base font-semibold text-white bg-gradient-to-r from-[#869D7A] to-[#A89EC9] hover:opacity-90 transition-all duration-200 flex items-center justify-center gap-2 shadow-md shadow-[#869D7A]/15"
        >
          Start Building Free
          <ArrowRight size={18} />
        </button>
        <button
          id="cta-demo"
          className="w-full sm:w-auto px-10 py-4 rounded-xl text-base font-semibold text-[#5B625E] border border-[#E6E2D8] hover:border-[#869D7A]/50 hover:text-[#2D312E] hover:bg-[#869D7A]/5 transition-all duration-200"
        >
          View Demo
        </button>
      </div>

      {/* Trust badges */}
      <div className="flex flex-wrap items-center justify-center gap-6 mt-12 text-sm text-[#5B625E]">
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
