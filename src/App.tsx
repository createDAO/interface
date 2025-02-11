import { useEffect, Suspense, lazy } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { Header } from '@components/Header/Header'
import Footer from '@components/Footer/Footer'

// Lazy load routes
const Home = lazy(() => import('@pages/home/Home'))
const DeployDao = lazy(() => import('@pages/deploy/DeployDao'))
const Verify = lazy(() => import('@pages/verify/Verify'))
const Community = lazy(() => import('@pages/community/Community'))

function App() {
  // Set dark theme by default
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    if (!savedTheme) {
      localStorage.setItem('theme', 'dark');
      document.documentElement.setAttribute('data-theme', 'dark');
    }
  }, []);

  return (
    <div className="app">
      <Header />
      <main>
        <Suspense fallback={<div className="loading">Loading...</div>}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/create-dao" element={<DeployDao />} />
            <Route path="/verify" element={<Verify />} />
            <Route path="/community" element={<Community />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Suspense>
      </main>
      <Footer />
    </div>
  )
}

export default App
