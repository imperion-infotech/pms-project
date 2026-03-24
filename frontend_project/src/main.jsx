/**
 * main.jsx
 * 
 * Application Bootstrap File.
 * Mounts the main React App component to the DOM ('root' div).
 * Imports global CSS styles including Tailwind CSS.
 */
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
