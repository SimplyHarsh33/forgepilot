import React from 'react'
import { Zap } from 'lucide-react'

export default function Navbar() {
  return (
    <nav className="h-16 border-b border-[#E6E2D8] bg-[#FAF8F5] flex items-center justify-between px-8">
      <div className="flex items-center gap-2 font-bold text-[#2D312E]">
        <div className="w-6 h-6 rounded bg-[#869D7A] flex items-center justify-center text-white">
          <Zap size={12} fill="white" />
        </div>
        <span>ForgePilot App</span>
      </div>
      <div className="flex gap-6 text-sm text-[#5B625E] font-medium">
        <a href="#" className="hover:text-[#2D312E]">Home</a>
        <a href="#" className="hover:text-[#2D312E]">Features</a>
        <a href="#" className="hover:text-[#2D312E]">Settings</a>
      </div>
    </nav>
  )
}