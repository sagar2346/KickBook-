import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Calendar, Clock, MapPin, CreditCard, XCircle, ChevronLeft } from 'lucide-react';
import api from '../utils/api';

const BookingDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [cancelling, setCancelling] = useState(false);

  useEffect(() => {
    const fetchBooking = async () => {
      try {
        const res = await api.get(`/bookings/${id}`);
        setBooking(res.data.booking);
      } catch (error) {
        console.error('Error fetching booking:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchBooking();
  }, [id]);

  const handleCancel = async () => {
    if (!window.confirm('Are you sure you want to cancel this booking?')) return;
    
    setCancelling(true);
    try {
      await api.put(`/bookings/${id}/cancel`);
      setBooking({ ...booking, status: 'Cancelled' });
    } catch (error) {
      alert('Failed to cancel booking');
    } finally {
      setCancelling(false);
    }
  };

  if (loading) return <div>Loading booking details...</div>;
  if (!booking) return <div>Booking not found.</div>;

  const getStatusColor = (status) => {
    switch (status) {
      case 'Confirmed': return 'var(--status-confirmed)';
      case 'Pending': return 'var(--status-pending)';
      case 'Cancelled': return 'var(--status-cancelled)';
      default: return 'var(--text-muted)';
    }
  };

  return (
    <div style={{ maxWidth: '700px', margin: '0 auto', animation: 'fadeIn 0.3s ease-out' }}>
      <Link to="/my-bookings" style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', marginBottom: '1.5rem', color: 'var(--primary-color)' }}>
        <ChevronLeft size={20} /> Back to My Bookings
      </Link>

      <div className="card" style={{ padding: '2rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', borderBottom: '1px solid var(--border-color)', paddingBottom: '1.5rem', marginBottom: '1.5rem' }}>
          <div>
            <h1 style={{ margin: '0 0 0.5rem 0', fontSize: '2rem' }}>Booking Details</h1>
            <p className="text-muted" style={{ margin: 0 }}>Booking ID: {booking._id}</p>
          </div>
          <div style={{ 
            padding: '0.5rem 1rem', 
            borderRadius: '20px', 
            fontWeight: 'bold',
            color: 'white',
            backgroundColor: getStatusColor(booking.status)
          }}>
            {booking.status}
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', marginBottom: '2rem' }}>
          <div>
            <h3 style={{ fontSize: '1.1rem', marginBottom: '1rem', color: 'var(--text-muted)' }}>Venue Information</h3>
            <div style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>{booking.venueId.name}</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-muted)' }}>
              <MapPin size={18} /> {booking.venueId.location}
            </div>
          </div>

          <div>
            <h3 style={{ fontSize: '1.1rem', marginBottom: '1rem', color: 'var(--text-muted)' }}>Date & Time</h3>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: '500', marginBottom: '0.5rem' }}>
              <Calendar size={18} color="var(--primary-color)" /> {new Date(booking.date).toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: '500' }}>
              <Clock size={18} color="var(--primary-color)" /> {booking.startTime} - {booking.endTime}
            </div>
          </div>
        </div>

        <div style={{ backgroundColor: 'var(--card-bg)', border: '1px solid var(--border-color)', borderRadius: '8px', padding: '1.5rem', marginBottom: '2rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: '500' }}><CreditCard size={18} /> Total Amount</span>
            <span style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'var(--primary-color)' }}>Rs. {booking.totalPrice}</span>
          </div>
          <div style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>Payment is to be made at the venue before the match begins.</div>
        </div>

        {booking.status !== 'Cancelled' && (
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <button 
              onClick={handleCancel}
              disabled={cancelling}
              className="btn" 
              style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', backgroundColor: 'white', color: 'var(--status-cancelled)', border: '1px solid var(--status-cancelled)' }}
            >
              <XCircle size={18} /> {cancelling ? 'Cancelling...' : 'Cancel Booking'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default BookingDetail;
