import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Clock, MapPin } from 'lucide-react';
import api from '../utils/api';

const MyBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const res = await api.get('/bookings');
        setBookings(res.data.bookings);
      } catch (error) {
        console.error('Error fetching bookings:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchBookings();
  }, []);

  const getStatusColor = (status) => {
    switch (status) {
      case 'Confirmed': return 'var(--status-confirmed)';
      case 'Pending': return 'var(--status-pending)';
      case 'Cancelled': return 'var(--status-cancelled)';
      default: return 'var(--text-muted)';
    }
  };

  return (
    <div style={{ maxWidth: '900px', margin: '0 auto', animation: 'fadeIn 0.3s ease-out' }}>
      <h1 style={{ marginBottom: '2rem' }}>My Bookings</h1>

      {loading ? (
        <div>Loading your bookings...</div>
      ) : bookings.length === 0 ? (
        <div className="card text-center" style={{ padding: '3rem' }}>
          <h3>You have no bookings yet.</h3>
          <p className="text-muted" style={{ marginBottom: '1.5rem' }}>Find a futsal ground and book your first game!</p>
          <Link to="/venues" className="btn">Browse Venues</Link>
        </div>
      ) : (
        <div style={{ display: 'grid', gap: '1.5rem' }}>
          {bookings.map(booking => (
            <div key={booking._id} className="card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '0.5rem' }}>
                  <h3 style={{ margin: 0, fontSize: '1.25rem' }}>{booking.venueId.name}</h3>
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
                </div>
                
                <div style={{ display: 'flex', gap: '1.5rem', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                    <MapPin size={16} /> {booking.venueId.location}
                  </span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                    <Calendar size={16} /> {new Date(booking.date).toLocaleDateString()}
                  </span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                    <Clock size={16} /> {booking.startTime} - {booking.endTime}
                  </span>
                </div>
              </div>

              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: '1.25rem', fontWeight: 'bold', color: 'var(--primary-color)', marginBottom: '0.5rem' }}>
                  Rs. {booking.totalPrice}
                </div>
                <Link to={`/bookings/${booking._id}`} className="btn" style={{ padding: '0.4rem 1rem', fontSize: '0.9rem', backgroundColor: 'transparent', border: '1px solid var(--primary-color)', color: 'var(--primary-color)' }}>
                  View Details
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyBookings;
