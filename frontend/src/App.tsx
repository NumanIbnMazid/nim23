import { Component, lazy } from 'solid-js'
import { Routes, Route } from '@solidjs/router'

import HiddenBackground from './comoponents/HiddenBackground'
import Navbar from './comoponents/Navbar'

const HomePage = lazy(() => import('./pages/HomePage'))

import AboutPage from './pages/AboutPage'

const App: Component = () => {
  return (
    <>
      <div>
        <HiddenBackground />
        <Navbar />
        <div class="max-w-8xl mx-auto px-4 sm:px-6 md:px-8 flex flex-wrap items-center justify-between max-w-screen-xl py-20">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/about" element={<AboutPage />} />
          </Routes>
        </div>
      </div>
    </>
  )
}

export default App
