import React, { useEffect, useMemo, useState } from 'react'
import SpaceScene from './components/SpaceScene'

const sections = [
  { title: 'On November 15th, 2009...', sub: '' },
  { title: '...a new royal was declared in the galaxy...', sub: '' },
  { title: 'Our Gundi Maharani Ji!', sub: '' },
  { title: 'A special wish for a milestone 15 years...', sub: '' },
  { title: 'Happy 15th Birthday, Bhumika!', sub: '' },
]

function useScrollSection(total = 5) {
  const [section, setSection] = useState(0)

  useEffect(() => {
    const onScroll = () => {
      const scrollTop = window.scrollY
      const docHeight = document.body.scrollHeight - window.innerHeight
      const progress = docHeight > 0 ? scrollTop / docHeight : 0
      setSection(Math.min(0.999, Math.max(0, progress)))
    }
    onScroll()
    window.addEventListener('scroll', onScroll)
    window.addEventListener('resize', onScroll)
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
    }
  }, [])

  return section
}

export default function App() {
  const sectionProgress = useScrollSection(sections.length)

  const overlayIndex = useMemo(() => {
    // Map continuous 0..1 to discrete 0..4
    return Math.min(4, Math.floor(sectionProgress * 5 + 0.0001))
  }, [sectionProgress])

  return (
    <div className="relative min-h-[500vh] bg-black text-white">
      <SpaceScene section={sectionProgress} />

      <div className="relative z-10 pointer-events-none">
        {sections.map((s, i) => (
          <section key={i} className="h-screen flex items-center justify-center">
            <div className={`max-w-3xl mx-auto px-6 text-center transition-opacity duration-500 ${overlayIndex === i ? 'opacity-100' : 'opacity-20'}`}>
              <h2 className={`text-3xl sm:text-5xl font-bold mb-4 ${i === 4 ? 'text-transparent bg-clip-text bg-gradient-to-r from-pink-300 via-yellow-200 to-blue-300 drop-shadow-[0_0_25px_rgba(255,255,255,0.6)]' : ''}`}>
                {s.title}
              </h2>
              {i === 4 && (
                <p className="text-lg sm:text-2xl opacity-90">
                  With love, across the stars.
                </p>
              )}
            </div>
          </section>
        ))}
      </div>

      <div className="fixed top-6 left-1/2 -translate-x-1/2 z-20 pointer-events-none">
        <div className="w-[90vw] max-w-2xl h-1 bg-white/10 rounded">
          <div className="h-full bg-gradient-to-r from-purple-400 via-pink-400 to-yellow-300 rounded" style={{ width: `${sectionProgress * 100}%` }} />
        </div>
      </div>
    </div>
  )
}
