import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import { AuthProvider } from './contexts/AuthContext.tsx'
import { InfoProvider } from './contexts/InfoContext.tsx'
import { PlayersProvider } from './contexts/PlayersContext.tsx'
import { ErrorBoundary } from './components/ErrorBoundary.tsx'
import './index.css'

const rootElement = document.getElementById('root');

if (!rootElement) {
  throw new Error('Root element not found');
}

ReactDOM.createRoot(rootElement).render(
  <React.StrictMode>
    <ErrorBoundary>
      <AuthProvider>
        <InfoProvider>
          <PlayersProvider>
            <App />
          </PlayersProvider>
        </InfoProvider>
      </AuthProvider>
    </ErrorBoundary>
  </React.StrictMode>,
)

