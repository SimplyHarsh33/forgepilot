import { useState, useEffect } from 'react'
import { Github, Zap, Menu, X } from 'lucide-react'

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const navLinks = [
    { label: 'Features', href: '#features' },
    { label: 'How It Works', href: '#how-it-works' },
  ]

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-[#0d1117]/85 backdrop-blur-xl border-b border-[#30363d]/60 shadow-xl shadow-black/20'
          : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-center justify-between h-16">

          {/* ── Logo ── */}
          <a href="#" id="nav-logo" className="flex items-center gap-2.5 group">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#58a6ff] to-[#a371f7] flex items-center justify-center shadow-lg shadow-[#58a6ff]/30 group-hover:scale-110 transition-transform duration-200">
              <Zap size={15} className="text-white" fill="white" />
            </div>
            <span className="font-bold text-lg text-[#e6edf3] tracking-tight">
              Forge<span className="text-[#58a6ff]">Pilot</span>
            </span>
          </a>

          {/* ── Desktop Nav Links ── */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                id={`nav-link-${link.label.toLowerCase().replace(/\s+/g, '-')}`}
                className="text-sm text-[#8b949e] hover:text-[#e6edf3] transition-colors duration-200"
              >
                {link.label}
              </a>
            ))}
            <a
              href="https://github.com"
              target="_blank"
              rel="noreferrer"
              id="nav-github"
              className="text-sm text-[#8b949e] hover:text-[#e6edf3] transition-colors duration-200 flex items-center gap-1.5"
            >
              <Github size={14} />
              GitHub
            </a>
          </div>

          {/* ── Desktop CTA Buttons ── */}
          <div className="hidden md:flex items-center gap-3">
            <button
              id="nav-login"
              className="px-4 py-2 text-sm text-[#8b949e] hover:text-[#e6edf3] transition-colors duration-200 rounded-lg hover:bg-white/5"
            >
              Log In
            </button>
            <button
              id="nav-cta"
              className="btn-primary px-5 py-2 text-sm font-semibold text-white bg-gradient-to-r from-[#58a6ff] to-[#a371f7] rounded-lg hover:opacity-90 transition-all duration-200 shadow-lg shadow-[#58a6ff]/20"
            >
              Start Building →
            </button>
          </div>

          {/* ── Mobile Hamburger ── */}
          <button
            id="nav-mobile-toggle"
            className="md:hidden p-2 rounded-lg text-[#8b949e] hover:text-[#e6edf3] hover:bg-white/5 transition-all duration-200"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* ── Mobile Menu ── */}
      <div
        className={`md:hidden transition-all duration-300 overflow-hidden ${
          mobileOpen ? 'max-h-80 opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        <div className="bg-[#0d1117]/95 backdrop-blur-xl border-b border-[#30363d]/60 px-6 py-4 flex flex-col gap-3">
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="text-sm text-[#8b949e] hover:text-[#e6edf3] py-1.5 transition-colors"
              onClick={() => setMobileOpen(false)}
            >
              {link.label}
            </a>
          ))}
          <a
            href="https://github.com"
            target="_blank"
            rel="noreferrer"
            className="text-sm text-[#8b949e] hover:text-[#e6edf3] py-1.5 flex items-center gap-1.5 transition-colors"
          >
            <Github size={14} /> GitHub
          </a>
          <div className="pt-3 border-t border-[#30363d]/60 flex flex-col gap-2">
            <button className="px-4 py-2.5 text-sm text-[#8b949e] border border-[#30363d] rounded-lg hover:border-[#58a6ff]/50 transition-colors">
              Log In
            </button>
            <button className="px-4 py-2.5 text-sm font-semibold text-white bg-gradient-to-r from-[#58a6ff] to-[#a371f7] rounded-lg hover:opacity-90 transition-opacity">
              Start Building →
            </button>
          </div>
        </div>
      </div>
    </nav>
  )
}

export default Navbar
