import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { Box } from '@chakra-ui/react';
import Navbar from './components/Navbar';
import Login from './components/Login';
import Register from './components/Register';
import Dashboard from './components/Dashboard';
import Calendar from './components/Calendar';
import DailyLog from './components/DailyLog';
import Profile from './components/Profile';
import { getAccessToken } from './auth';
import { motion } from 'framer-motion';

const PrivateRoute = ({ children }) => {
  return getAccessToken() ? children : <Navigate to="/login" />;
};

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(!!getAccessToken());

  return (
    <Router>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <Box minH="100vh">
          {isAuthenticated && <Navbar setIsAuthenticated={setIsAuthenticated} />}
          <Box pt={isAuthenticated ? "80px" : 0} px={4}>
            <Routes>
              <Route path="/login" element={<Login setIsAuthenticated={setIsAuthenticated} />} />
              <Route path="/register" element={<Register setIsAuthenticated={setIsAuthenticated} />} />
              <Route
                path="/dashboard"
                element={
                  <PrivateRoute>
                    <Dashboard />
                  </PrivateRoute>
                }
              />
              <Route
                path="/calendar"
                element={
                  <PrivateRoute>
                    <Calendar />
                  </PrivateRoute>
                }
              />
              <Route
                path="/daily-log"
                element={
                  <PrivateRoute>
                    <DailyLog />
                  </PrivateRoute>
                }
              />
              <Route
                path="/profile"
                element={
                  <PrivateRoute>
                    <Profile />
                  </PrivateRoute>
                }
              />
              <Route path="/" element={<Navigate to="/login" />} />
            </Routes>
          </Box>
        </Box>
      </motion.div>
    </Router>
  );
}

export default App;