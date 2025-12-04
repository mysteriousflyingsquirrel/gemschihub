import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Layout } from './components/Layout';
import { ProtectedRoute } from './components/ProtectedRoute';
import { Login } from './pages/Login';
import { Info } from './pages/Info';
import { Events } from './pages/Events';
import { Spieler } from './pages/Spieler';
import { Verfassung } from './pages/Verfassung';
import { Patchsystem } from './pages/Patchsystem';
import { Admin } from './pages/Admin';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Layout>
                <Navigate to="/info" replace />
              </Layout>
            </ProtectedRoute>
          }
        />
        
        <Route
          path="/info"
          element={
            <ProtectedRoute>
              <Layout>
                <Info />
              </Layout>
            </ProtectedRoute>
          }
        />
        
        <Route
          path="/events"
          element={
            <ProtectedRoute>
              <Layout>
                <Events />
              </Layout>
            </ProtectedRoute>
          }
        />
        
        <Route
          path="/spieler"
          element={
            <ProtectedRoute>
              <Layout>
                <Spieler />
              </Layout>
            </ProtectedRoute>
          }
        />
        
        <Route
          path="/verfassung"
          element={
            <ProtectedRoute>
              <Layout>
                <Verfassung />
              </Layout>
            </ProtectedRoute>
          }
        />
        
        <Route
          path="/patchsystem"
          element={
            <ProtectedRoute>
              <Layout>
                <Patchsystem />
              </Layout>
            </ProtectedRoute>
          }
        />
        
        <Route
          path="/admin"
          element={
            <ProtectedRoute>
              <Layout>
                <Admin />
              </Layout>
            </ProtectedRoute>
          }
        />
        
        <Route
          path="*"
          element={
            <Navigate to="/info" replace />
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;

