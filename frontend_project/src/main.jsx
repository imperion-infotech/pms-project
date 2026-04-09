/**
 * main.jsx - Application Entry Point
 *
 * Yeh poore frontend project ka darwaza (entrance) hai.
 * React yaha se shuru hota hai aur HTML ke 'root' div mein 
 * poore app ko load karta hai.
 */
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css' // Global styles yaha se aate hain
import App from './App.jsx' // Main Router/App component

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
