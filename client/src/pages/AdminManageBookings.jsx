import React, { useState, useEffect } from 'react';
import api from '../utils/api';

const AdminManageBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      const res = await api.get('/bookings');
      setBookings(res.data.bookings);
    } catch (error) {
      console.error('Failed to fetch bookings');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (id, newStatus) => {
    try {
      await api.put(`/bookings/${id}/status`, { status: newStatus });
      setBookings(bookings.map(b => b._id === id ? { ...b, status: newStatus } : b));
    } catch (error) {
      alert('Failed to update status');
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Confirmed': return 'var(--status-confirmed)';
      case 'Pending': return 'var(--status-pending)';
      case 'Cancelled': return 'var(--status-cancelled)';
      default: return 'var(--text-muted)';
    }
  };

  return (
    <div style={{ animation: 'fadeIn 0.3s ease-out' }}>
      <h1 style={{ marginBottom: '2rem' }}>Manage Bookings</h1>

      <div className="card" style={{ padding: 0, overflowX: 'auto' }}>
        {loading ? (
          <div style={{ padding: '2rem', textAlign: 'center' }}>Loading bookings...</div>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ backgroundColor: '#F3F4F6', borderBottom: '1px solid var(--border-color)' }}>
                <th style={{ padding: '1rem' }}>User</th>
                <th style={{ padding: '1rem' }}>Venue</th>
                <th style={{ padding: '1rem' }}>Date/Time</th>
                <th style={{ padding: '1rem' }}>Total</th>
                <th style={{ padding: '1rem' }}>Status</th>
                <th style={{ padding: '1rem' }}>Update Status</th>
              </tr>
            </thead>
            <tbody>
              {bookings.map(booking => (
                <tr key={booking._id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                  <td style={{ padding: '1rem' }}>
                    <div style={{ fontWeight: '500' }}>{booking.userId?.name || 'Unknown'}</div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{booking.userId?.phone}</div>
                  </td>
                  <td style={{ padding: '1rem', fontWeight: '500' }}>{booking.venueId?.name}</td>
                  <td style={{ padding: '1rem' }}>
                    <div>{new Date(booking.date).toLocaleDateString()}</div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{booking.startTime} - {booking.endTime}</div>
                  </td>
                  <td style={{ padding: '1rem', fontWeight: '500' }}>Rs. {booking.totalPrice}</td>
                  <td style={{ padding: '1rem' }}>
                    <span style={{ 
                      padding: '0.2rem 0.6rem', 
                      borderRadius: '12px', 
                      fontSize: '0.8rem', 
                      fontWeight: 'bold',
                      color: 'white',
                      backgroundColor: getStatusColor(booking.status)
                    }}>
                      {booking.status}
                    </span>
                  </td>
                  <td style={{ padding: '1rem' }}>
                    <select 
                      value={booking.status}
                      onChange={(e) => handleStatusChange(booking._id, e.target.value)}
                      style={{ padding: '0.4rem', borderRadius: '4px', border: '1px solid var(--border-color)' }}
                    >
                      <option value="Pending">Pending</option>
                      <option value="Confirmed">Confirmed</option>
                      <option value="Cancelled">Cancelled</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default AdminManageBookings;
