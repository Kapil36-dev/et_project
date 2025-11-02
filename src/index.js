import React from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App'
import { SessionProvider } from './session'
import './App.css'
import Register from './pages/Register';

// Ensure there is a div#root in public/index.html
const container = document.getElementById('root')
if (!container) {
  throw new Error('Root element not found. Make sure public/index.html contains <div id="root"></div>.')
}

const root = createRoot(container)

root.render(
  <React.StrictMode>
    <SessionProvider>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </SessionProvider>
  </React.StrictMode>
)
