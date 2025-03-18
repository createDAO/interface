import React from 'react'
import ReactDOM from 'react-dom/client'
import { WagmiProvider } from 'wagmi'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { BrowserRouter } from 'react-router-dom'
import { config as wagmiConfig } from '@config/wagmi'
import App from './App'
import './index.css'

// Create a client for react-query
const queryClient = new QueryClient()

// Initialize theme based on system preference
const initializeTheme = () => {
  // Set dark theme as default
  const savedTheme = localStorage.getItem('theme')
  if (savedTheme) {
    document.documentElement.setAttribute('data-theme', savedTheme)
    return
  }

  // Default to dark theme
  document.documentElement.setAttribute('data-theme', 'light')
  localStorage.setItem('theme', 'light')
}

initializeTheme()

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <WagmiProvider config={wagmiConfig}>
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </QueryClientProvider>
    </WagmiProvider>
  </React.StrictMode>,
)
