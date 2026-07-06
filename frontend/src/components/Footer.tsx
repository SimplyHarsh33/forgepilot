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
  <footer className="border-t border-[#E6E2D8]/60 bg-[#F5F2EB]">
    <div className="max-w-7xl mx-auto px-6 py-16">
      {/* Top: Logo + links */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
        {/* Brand column */}
        <div className="md:col-span-1">
          <a href="#" className="flex items-center gap-2.5 mb-4 group w-fit">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#869D7A] to-[#A89EC9] flex items-center justify-center shadow-md group-hover:scale-110 transition-transform duration-200">
              <Zap size={15} className="text-white" fill="white" />
            </div>
            <span className="font-bold text-lg text-[#2D312E] tracking-tight">
              Forge<span className="text-[#869D7A]">Pilot</span>
            </span>
          </a>
          <p className="text-sm text-[#5B625E] leading-relaxed mb-6">
            An AI-powered developer workspace. Generate, edit, and manage project files using natural language.
          </p>
          {/* Social icons */}
          <div className="flex items-center gap-3">
            <a
              href="https://github.com"
              target="_blank"
              rel="noreferrer"
              id="footer-github"
              className="w-9 h-9 rounded-lg bg-[#FAF8F5] border border-[#E6E2D8] flex items-center justify-center text-[#5B625E] hover:text-[#2D312E] hover:border-[#869D7A]/50 transition-all duration-200"
            >
              <Github size={16} />
            </a>
            <a
              href="https://twitter.com"
              target="_blank"
              rel="noreferrer"
              id="footer-twitter"
              className="w-9 h-9 rounded-lg bg-[#FAF8F5] border border-[#E6E2D8] flex items-center justify-center text-[#5B625E] hover:text-[#2D312E] hover:border-[#869D7A]/50 transition-all duration-200"
            >
              <Twitter size={16} />
            </a>
          </div>
        </div>

        {/* Link columns */}
        {Object.entries(footerLinks).map(([category, links]) => (
          <div key={category}>
            <h4 className="text-xs font-semibold text-[#2D312E] uppercase tracking-widest mb-4">
              {category}
            </h4>
            <ul className="space-y-3">
              {links.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    target={link.href.startsWith('http') ? '_blank' : undefined}
                    rel={link.href.startsWith('http') ? 'noreferrer' : undefined}
                    className="text-sm text-[#5B625E] hover:text-[#2D312E] transition-colors duration-200"
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
      <div className="pt-8 border-t border-[#E6E2D8]/60 flex flex-col sm:flex-row items-center justify-between gap-4">
        <p className="text-sm text-[#5B625E]">
          © {new Date().getFullYear()} ForgePilot. All rights reserved.
        </p>
        <div className="flex items-center gap-2 text-xs text-[#5B625E]">
          <span className="w-1.5 h-1.5 rounded-full bg-[#869D7A] animate-pulse" />
          <span>All systems operational</span>
        </div>
      </div>
    </div>
  </footer>
)

export default Footer
