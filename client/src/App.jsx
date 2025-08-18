import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import ProtectedRoute from './components/ProtectedRoute';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import LoginRegister from './pages/LoginRegister';
import AllVenues from './pages/AllVenues';
import VenueDetail from './pages/VenueDetail';
import BookSlot from './pages/BookSlot';
import MyBookings from './pages/MyBookings';
import BookingDetail from './pages/BookingDetail';
import AdminDashboard from './pages/AdminDashboard';
import AdminManageVenues from './pages/AdminManageVenues';
import AdminManageBookings from './pages/AdminManageBookings';
import UserProfile from './pages/UserProfile';
import Reviews from './pages/Reviews';

// Basic Placeholder components for missing pages
const Placeholder = ({ name }) => (
  <div className="placeholder-screen card text-center" style={{ margin: '3rem auto', textAlign: 'center' }}>
    <h2 style={{ fontSize: '2rem', marginBottom: '1rem' }}>{name} Page</h2>
    <p className="text-muted">This page is currently being restored. Stay tuned!</p>
  </div>
);

// All pages are fully restored and imported above.

function App() {
  return (
    <Router>
      <div className="app-container">
        <Navbar />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/venues" element={<AllVenues />} />
            <Route path="/venues/:id" element={<VenueDetail />} />
            <Route path="/login" element={<LoginRegister />} />

            {/* Protected User Routes */}
            <Route path="/book/:id" element={<ProtectedRoute><BookSlot /></ProtectedRoute>} />
            <Route path="/my-bookings" element={<ProtectedRoute><MyBookings /></ProtectedRoute>} />
            <Route path="/bookings/:id" element={<ProtectedRoute><BookingDetail /></ProtectedRoute>} />
            <Route path="/profile" element={<ProtectedRoute><UserProfile /></ProtectedRoute>} />
            <Route path="/reviews/:venueId" element={<ProtectedRoute><Reviews /></ProtectedRoute>} />

            {/* Protected Admin Routes */}
            <Route path="/admin" element={<ProtectedRoute requireAdmin><AdminDashboard /></ProtectedRoute>} />
            <Route path="/admin/venues" element={<ProtectedRoute requireAdmin><AdminManageVenues /></ProtectedRoute>} />
            <Route path="/admin/bookings" element={<ProtectedRoute requireAdmin><AdminManageBookings /></ProtectedRoute>} />
            
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
