import React from 'react'
import Navbar from './components/Navbar'
import Counter from './components/Counter'

function App() {
  return (
    <div className="min-h-screen bg-[#FDFBF7] text-[#2D312E]">
      <Navbar />
      <main className="max-w-4xl mx-auto px-6 py-20 text-center">
        <h1 className="text-5xl font-black tracking-tight mb-4">
          Welcome to your <span className="text-[#869D7A]">ForgePilot</span> Project
        </h1>
        <p className="text-[#5B625E] text-lg max-w-xl mx-auto mb-10">
          This React component is compiled client-side in real-time. Edit files in the Monaco Editor or ask the AI assistant to make modifications.
        </p>
        <Counter />
      </main>
    </div>
  )
}

export default App