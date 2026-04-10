/**
 * main.jsx - Application Entry Point
 *
 * Yeh poore frontend project ka darwaza (entrance) hai.
 * React yaha se shuru hota hai aur HTML ke 'root' div mein
 * poore app ko load karta hai.
 */
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query' // Industrial Data Fetching
import './index.css'
import App from './App.jsx'

/**
 * 1. QueryClient Initialization
 * Humne yaha ek gloabl client banaya hai jo caching aur
 * background data fetching ko handle karega.
 */
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minute tak data cache rahega
      retry: 1, // Fail hone par 1 baar auto-retry hoga
      refetchOnWindowFocus: false, // Window change hone par faltu refresh rokne ke liye
    },
  },
})

createRoot(document.getElementById('root')).render(
  <StrictMode>
    {/* Global Query Provider: Poore app mein data sync handle karne ke liye */}
    <QueryClientProvider client={queryClient}>
      <App />
    </QueryClientProvider>
  </StrictMode>,
)
