import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Users, MapPin, CalendarCheck, TrendingUp } from 'lucide-react';
import api from '../utils/api';

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    users: 0,
    venues: 0,
    bookings: 0,
    revenue: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await api.get('/stats');
        setStats({
          users: res.data.stats.totalUsers || 0,
          venues: res.data.stats.totalVenues || 0,
          bookings: res.data.stats.totalBookings || 0,
          revenue: res.data.stats.totalRevenue || 0
        });
      } catch (error) {
        console.error('Failed to fetch stats');
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  const StatCard = ({ title, value, icon, color }) => (
    <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', padding: '1.5rem' }}>
      <div style={{ backgroundColor: `${color}20`, color: color, padding: '1rem', borderRadius: '50%' }}>
        {icon}
      </div>
      <div>
        <h3 style={{ margin: 0, fontSize: '1rem', color: 'var(--text-muted)' }}>{title}</h3>
        <div style={{ fontSize: '1.8rem', fontWeight: 'bold' }}>{value}</div>
      </div>
    </div>
  );

  return (
    <div style={{ animation: 'fadeIn 0.3s ease-out' }}>
      <h1 style={{ marginBottom: '2rem' }}>Admin Dashboard</h1>

      {loading ? (
        <div>Loading dashboard statistics...</div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.5rem', marginBottom: '3rem' }}>
          <StatCard title="Total Users" value={stats.users} icon={<Users size={28} />} color="#3B82F6" />
          <StatCard title="Total Venues" value={stats.venues} icon={<MapPin size={28} />} color="#10B981" />
          <StatCard title="Total Bookings" value={stats.bookings} icon={<CalendarCheck size={28} />} color="#F59E0B" />
          <StatCard title="Total Revenue" value={`Rs. ${stats.revenue}`} icon={<TrendingUp size={28} />} color="#8B5CF6" />
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
        <div className="card" style={{ padding: '2rem' }}>
          <h2 style={{ marginBottom: '1rem' }}>Manage Venues</h2>
          <p className="text-muted" style={{ marginBottom: '1.5rem' }}>Add new futsal grounds, update details, or remove inactive venues.</p>
          <Link to="/admin/venues" className="btn">Go to Venues</Link>
        </div>
        <div className="card" style={{ padding: '2rem' }}>
          <h2 style={{ marginBottom: '1rem' }}>Manage Bookings</h2>
          <p className="text-muted" style={{ marginBottom: '1.5rem' }}>View all system bookings, update statuses, or cancel fraudulent bookings.</p>
          <Link to="/admin/bookings" className="btn">Go to Bookings</Link>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
