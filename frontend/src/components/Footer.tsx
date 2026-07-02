import { Github, Twitter, Zap } from 'lucide-react'

const footerLinks = {
  Product: [
    { label: 'Features', href: '#features' },
    { label: 'How It Works', href: '#how-it-works' },
    { label: 'Changelog', href: '#' },
    { label: 'Roadmap', href: '#' },
  ],
  Developers: [
    { label: 'Documentation', href: '#' },
    { label: 'API Reference', href: '#' },
    { label: 'GitHub', href: 'https://github.com' },
    { label: 'Contribute', href: '#' },
  ],
  Company: [
    { label: 'About', href: '#' },
    { label: 'Blog', href: '#' },
    { label: 'Privacy Policy', href: '#' },
    { label: 'Terms of Service', href: '#' },
  ],
}

const Footer = () => (
  <footer className="border-t border-[#30363d]/60 bg-[#0d1117]">
    <div className="max-w-7xl mx-auto px-6 py-16">
      {/* Top: Logo + links */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
        {/* Brand column */}
        <div className="md:col-span-1">
          <a href="#" className="flex items-center gap-2.5 mb-4 group w-fit">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#58a6ff] to-[#a371f7] flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-200">
              <Zap size={15} className="text-white" fill="white" />
            </div>
            <span className="font-bold text-lg text-[#e6edf3] tracking-tight">
              Forge<span className="text-[#58a6ff]">Pilot</span>
            </span>
          </a>
          <p className="text-sm text-[#8b949e] leading-relaxed mb-6">
            An AI-powered developer workspace. Generate, edit, and manage project files using natural language.
          </p>
          {/* Social icons */}
          <div className="flex items-center gap-3">
            <a
              href="https://github.com"
              target="_blank"
              rel="noreferrer"
              id="footer-github"
              className="w-9 h-9 rounded-lg bg-[#161b22] border border-[#30363d] flex items-center justify-center text-[#8b949e] hover:text-[#e6edf3] hover:border-[#58a6ff]/50 transition-all duration-200"
            >
              <Github size={16} />
            </a>
            <a
              href="https://twitter.com"
              target="_blank"
              rel="noreferrer"
              id="footer-twitter"
              className="w-9 h-9 rounded-lg bg-[#161b22] border border-[#30363d] flex items-center justify-center text-[#8b949e] hover:text-[#e6edf3] hover:border-[#58a6ff]/50 transition-all duration-200"
            >
              <Twitter size={16} />
            </a>
          </div>
        </div>

        {/* Link columns */}
        {Object.entries(footerLinks).map(([category, links]) => (
          <div key={category}>
            <h4 className="text-xs font-semibold text-[#e6edf3] uppercase tracking-widest mb-4">
              {category}
            </h4>
            <ul className="space-y-3">
              {links.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    target={link.href.startsWith('http') ? '_blank' : undefined}
                    rel={link.href.startsWith('http') ? 'noreferrer' : undefined}
                    className="text-sm text-[#8b949e] hover:text-[#e6edf3] transition-colors duration-200"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {/* Bottom bar */}
      <div className="pt-8 border-t border-[#30363d]/60 flex flex-col sm:flex-row items-center justify-between gap-4">
        <p className="text-sm text-[#8b949e]">
          © {new Date().getFullYear()} ForgePilot. Built with ❤️ and Claude AI.
        </p>
        <div className="flex items-center gap-2 text-xs text-[#8b949e]">
          <span className="w-1.5 h-1.5 rounded-full bg-[#3fb950] animate-pulse" />
          <span>All systems operational</span>
        </div>
      </div>
    </div>
  </footer>
)

export default Footer
