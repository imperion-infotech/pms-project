/**
 * main.jsx
 *
 * Ye app ka entrance hai. React yahan se shuru hota hai.
 * Yahan se app HTML ke 'root' div mein attach hota hai.
 * CSS files bhi yahan import hoti hain.
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
