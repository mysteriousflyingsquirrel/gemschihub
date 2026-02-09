import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Layout } from './components/Layout';
import { AdminRoute } from './components/ProtectedRoute';
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
        {/* Auth route */}
        <Route path="/login" element={<Login />} />

        {/* Public routes — no login required */}
        <Route path="/" element={<Layout><Navigate to="/info" replace /></Layout>} />
        <Route path="/info" element={<Layout><Info /></Layout>} />
        <Route path="/events" element={<Layout><Events /></Layout>} />
        <Route path="/spieler" element={<Layout><Spieler /></Layout>} />
        <Route path="/verfassung" element={<Layout><Verfassung /></Layout>} />
        <Route path="/patchsystem" element={<Layout><Patchsystem /></Layout>} />

        {/* Admin route — requires Captain login */}
        <Route
          path="/admin"
          element={
            <AdminRoute>
              <Layout>
                <Admin />
              </Layout>
            </AdminRoute>
          }
        />

        {/* Catch-all */}
        <Route path="*" element={<Navigate to="/info" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
