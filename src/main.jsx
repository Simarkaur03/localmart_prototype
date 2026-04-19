import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import * as Sentry from "@sentry/react"
import posthog from 'posthog-js'
import OneSignal from 'react-onesignal'
import './index.css'
import App from './App.jsx'

// Initialize OneSignal
OneSignal.init({
  appId: import.meta.env.VITE_ONESIGNAL_APP_ID || 'placeholder-id',
  allowLocalhostAsSecureOrigin: true,
  promptOptions: {
    slidedown: {
      prompts: [{
        type: 'push',
        autoPrompt: false,
        text: {
          actionMessage: 'Get notified when your order status changes',
          acceptButton: 'Allow',
          cancelButton: 'Later'
        }
      }]
    }
  }
});

// Initialize TanStack Query
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: true,
      retry: 1,
      staleTime: 60 * 1000, 
    },
  },
})

// Initialize Sentry
Sentry.init({
  dsn: "https://placeholder-dsn@sentry.io/placeholder", 
  integrations: [Sentry.browserTracingIntegration()],
  tracesSampleRate: 0.1,
})

// Initialize PostHog
posthog.init('placeholder-token', { 
    api_host: 'https://app.posthog.com',
    autocapture: true
})

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Toaster position="top-center" />
        <App />
      </BrowserRouter>
    </QueryClientProvider>
  </StrictMode>,
)
