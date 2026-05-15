import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import DashboardPage from './pages/DashboardPage';
import ReportPage from './pages/ReportPage';
import IncidentDetailPage from './pages/IncidentDetailPage';
import ManagePage from './pages/ManagePage';

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<DashboardPage />} />
        <Route path="/report" element={<ReportPage />} />
        <Route path="/incidents/:id" element={<IncidentDetailPage />} />
        <Route path="/manage" element={<ManagePage />} />
      </Routes>
    </Router>
  );
}

export default App;
