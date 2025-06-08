// src/App.tsx
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import PrivateRoute from './components/PrivateRoute';
import AppLayout from './components/AppLayout';

import LandingPage from './pages/LandingPage';
import LoginPage   from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import CalendarPage  from './pages/CalendarPage';
import EntriesPage   from './pages/EntriesPage';
import ProfilePage   from './pages/ProfilePage';

function App() {
  const { user } = useAuth();
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />

        <Route
          path="/login"
          element={user ? <Navigate to="/app/dashboard" replace /> : <LoginPage />}
        />
        <Route
          path="/register"
          element={user ? <Navigate to="/app/dashboard" replace /> : <RegisterPage />}
        />

        {/* All logged-in routes under /app */}
        <Route
          path="/app/*"
          element={
            <PrivateRoute>
              <AppLayout>
                <Routes>
                  <Route path="dashboard" element={<DashboardPage />} />
                  <Route path="calendar"  element={<CalendarPage />} />
                  <Route path="entries"   element={<EntriesPage />} />
                  <Route path="profile"   element={<ProfilePage />} />
                  <Route index element={<Navigate to="dashboard" replace />} />
                </Routes>
              </AppLayout>
            </PrivateRoute>
          }
        />

        <Route
          path="*"
          element={<Navigate to={user ? '/app' : '/login'} replace />}
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
