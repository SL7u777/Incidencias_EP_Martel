import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';
import DashboardPage from './pages/DashboardPage';
import ReportPage from './pages/ReportPage';
import IncidentDetailPage from './pages/IncidentDetailPage';
import ManagePage from './pages/ManagePage';
import LoginPage from './pages/LoginPage';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Navbar />
        <Routes>
          <Route path="/" element={<DashboardPage />} />
          <Route path="/report" element={<ReportPage />} />
          <Route path="/incidents/:id" element={<IncidentDetailPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/manage" element={
            <ProtectedRoute>
              <ManagePage />
            </ProtectedRoute>
          } />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
