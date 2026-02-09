import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import { AuthProvider } from './contexts/AuthContext.tsx'
import { SeasonsProvider } from './contexts/SeasonsContext.tsx'
import { EventsProvider } from './contexts/EventsContext.tsx'
import { PlayersProvider } from './contexts/PlayersContext.tsx'
import { AttendanceProvider } from './contexts/AttendanceContext.tsx'
import { SpiritProvider } from './contexts/SpiritContext.tsx'
import { InfoProvider } from './contexts/InfoContext.tsx'
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
        <SeasonsProvider>
          <PlayersProvider>
            <EventsProvider>
              <AttendanceProvider>
                <SpiritProvider>
                  <InfoProvider>
                    <App />
                  </InfoProvider>
                </SpiritProvider>
              </AttendanceProvider>
            </EventsProvider>
          </PlayersProvider>
        </SeasonsProvider>
      </AuthProvider>
    </ErrorBoundary>
  </React.StrictMode>,
)
