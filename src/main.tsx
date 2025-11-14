import React from 'react'
import ReactDOM from 'react-dom/client'
import { Analytics } from '@vercel/analytics/react'
import { initializePostHog, trackPageViewed } from './lib/posthog'
import App from './App.tsx'
import './index.css'

const rootElement = document.getElementById('root')
if (!rootElement) {
  throw new Error('Failed to find the root element')
}

// Initialize PostHog before rendering React app
initializePostHog()

// Track initial page view
trackPageViewed()

ReactDOM.createRoot(rootElement).render(
  <React.StrictMode>
    <App />
    <Analytics />
  </React.StrictMode>,
)
