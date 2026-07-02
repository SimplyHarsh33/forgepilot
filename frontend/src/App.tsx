import { useState } from 'react'
import { WorkspaceProvider, useWorkspace } from './context/WorkspaceContext'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import Features from './components/Features'
import HowItWorks from './components/HowItWorks'
import CTASection from './components/CTASection'
import Footer from './components/Footer'
import Dashboard from './components/Dashboard'
import Workspace from './components/Workspace'

function WorkspaceApp() {
  const { projectName } = useWorkspace()
  const [view, setView] = useState<'landing' | 'dashboard'>('landing')

  const enterDashboard = () => setView('dashboard')

  // If inside active project workspace
  if (projectName) {
    return <Workspace />
  }

  // Dashboard creation screen
  if (view === 'dashboard') {
    return <Dashboard />
  }

  // Otherwise, render landing page
  return (
    <div className="bg-[#FDFBF7] min-h-screen text-[#2D312E] font-sans overflow-x-hidden">
      <Navbar onStartBuilding={enterDashboard} />
      <main>
        <Hero onStartBuilding={enterDashboard} />
        <Features />
        <HowItWorks />
        <CTASection onStartBuilding={enterDashboard} />
      </main>
      <Footer />
    </div>
  )
}

function App() {
  return (
    <WorkspaceProvider>
      <WorkspaceApp />
    </WorkspaceProvider>
  )
}

export default App
