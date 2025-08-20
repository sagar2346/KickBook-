import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { Calendar, Clock, CheckCircle } from 'lucide-react';
import api from '../utils/api';

const BookSlot = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  const [venue, setVenue] = useState(null);
  const [loading, setLoading] = useState(true);
  const [bookingData, setBookingData] = useState({
    date: '',
    startTime: '',
    endTime: ''
  });
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const fetchVenue = async () => {
      try {
        const res = await api.get(`/venues/${id}`);
        setVenue(res.data.venue);
        // Default date to today
        const today = new Date().toISOString().split('T')[0];
        setBookingData(prev => ({ ...prev, date: today }));
      } catch (error) {
        console.error('Error fetching venue details:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchVenue();
  }, [id]);

  const calculateTotal = () => {
    if (!bookingData.startTime || !bookingData.endTime || !venue) return 0;
    const start = parseInt(bookingData.startTime.split(':')[0]);
    const end = parseInt(bookingData.endTime.split(':')[0]);
    const hours = end - start;
    return hours > 0 ? hours * venue.pricePerHour : 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    const start = parseInt(bookingData.startTime.split(':')[0]);
    const end = parseInt(bookingData.endTime.split(':')[0]);
    
    if (end <= start) {
      setError('End time must be after start time');
      return;
    }

    setSubmitting(true);
    try {
      const res = await api.post('/bookings', {
        venueId: id,
        date: bookingData.date,
        startTime: bookingData.startTime,
        endTime: bookingData.endTime,
        totalPrice: calculateTotal()
      });
      navigate(`/bookings/${res.data.booking._id}`);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create booking');
      setSubmitting(false);
    }
  };

  if (loading) return <div>Loading booking details...</div>;
  if (!venue) return <div>Venue not found.</div>;

  const total = calculateTotal();

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', animation: 'fadeIn 0.3s ease-out' }}>
      <h1 style={{ marginBottom: '2rem' }}>Book a Slot</h1>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
        {/* Booking Form */}
        <div className="card">
          <h2 style={{ marginBottom: '1.5rem', fontSize: '1.5rem' }}>Select Time</h2>
          
          {error && <div style={{ color: 'var(--status-cancelled)', marginBottom: '1rem', padding: '0.5rem', backgroundColor: '#FEF2F2', borderRadius: '4px' }}>{error}</div>}
          
          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem', fontWeight: '500' }}>
                <Calendar size={18} /> Date
              </label>
              <input 
                type="date"
                required
                min={new Date().toISOString().split('T')[0]}
                value={bookingData.date}
                onChange={(e) => setBookingData({ ...bookingData, date: e.target.value })}
                style={{ width: '100%', padding: '0.8rem', borderRadius: '4px', border: '1px solid var(--border-color)' }}
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '2rem' }}>
              <div>
                <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem', fontWeight: '500' }}>
                  <Clock size={18} /> Start Time
                </label>
                <input 
                  type="time"
                  required
                  step="3600"
                  value={bookingData.startTime}
                  onChange={(e) => setBookingData({ ...bookingData, startTime: e.target.value })}
                  style={{ width: '100%', padding: '0.8rem', borderRadius: '4px', border: '1px solid var(--border-color)' }}
                />
              </div>
              <div>
                <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem', fontWeight: '500' }}>
                  <Clock size={18} /> End Time
                </label>
                <input 
                  type="time"
                  required
                  step="3600"
                  value={bookingData.endTime}
                  onChange={(e) => setBookingData({ ...bookingData, endTime: e.target.value })}
                  style={{ width: '100%', padding: '0.8rem', borderRadius: '4px', border: '1px solid var(--border-color)' }}
                />
              </div>
            </div>

            <button type="submit" className="btn" disabled={submitting || total <= 0} style={{ width: '100%', padding: '1rem', fontSize: '1.1rem' }}>
              {submitting ? 'Confirming...' : 'Confirm Booking'}
            </button>
          </form>
        </div>

        {/* Summary */}
        <div>
          <div className="card" style={{ backgroundColor: 'var(--primary-color)', color: 'white' }}>
            <h2 style={{ color: 'white', marginBottom: '1.5rem', fontSize: '1.5rem', borderBottom: '1px solid rgba(255,255,255,0.2)', paddingBottom: '1rem' }}>Summary</h2>
            
            <div style={{ marginBottom: '1rem' }}>
              <div style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>{venue.name}</div>
              <div style={{ opacity: 0.8 }}>{venue.location}</div>
            </div>

            <div style={{ margin: '1.5rem 0', padding: '1.5rem 0', borderTop: '1px solid rgba(255,255,255,0.2)', borderBottom: '1px solid rgba(255,255,255,0.2)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                <span>Date:</span>
                <span style={{ fontWeight: 'bold' }}>{bookingData.date || 'Not selected'}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>Time:</span>
                <span style={{ fontWeight: 'bold' }}>
                  {bookingData.startTime ? `${bookingData.startTime} - ${bookingData.endTime}` : 'Not selected'}
                </span>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '1.2rem' }}>
              <span>Total Price:</span>
              <span style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'var(--accent-color)' }}>Rs. {total}</span>
            </div>
          </div>
          
          <div style={{ marginTop: '1rem', display: 'flex', gap: '0.5rem', color: 'var(--text-muted)' }}>
            <CheckCircle size={20} color="var(--status-confirmed)" />
            <span>Instant confirmation</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookSlot;
