import React, { useState } from 'react'

export default function Counter() {
  const [count, setCount] = useState(0)
  return (
    <div className="inline-flex flex-col items-center p-6 bg-[#F5F2EB] border border-[#E6E2D8] rounded-2xl shadow-sm">
      <span className="text-3xl font-extrabold text-[#2D312E] mb-2">{count}</span>
      <p className="text-xs text-[#5B625E] mb-4">React state is fully reactive inside the Sandbox</p>
      <button 
        onClick={() => setCount(c => c + 1)}
        className="px-6 py-2.5 bg-[#869D7A] hover:bg-[#869D7A]/95 text-white font-semibold rounded-lg text-sm transition-all shadow-sm"
      >
        Increment counter 
      </button>
    </div>
  )
}