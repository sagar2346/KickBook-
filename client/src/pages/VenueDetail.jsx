import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { MapPin, Star, Clock, Info, CheckCircle } from 'lucide-react';
import api from '../utils/api';

const VenueDetail = () => {
  const { id } = useParams();
  const [venue, setVenue] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchVenue = async () => {
      try {
        const res = await api.get(`/venues/${id}`);
        setVenue(res.data.venue);
      } catch (error) {
        console.error('Error fetching venue details:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchVenue();
  }, [id]);

  if (loading) return <div>Loading venue details...</div>;
  if (!venue) return <div>Venue not found.</div>;

  return (
    <div style={{ animation: 'fadeIn 0.3s ease-out', maxWidth: '1000px', margin: '0 auto' }}>
      
      {/* Header Image Area */}
      <div style={{ height: '350px', backgroundColor: 'var(--primary-color)', borderRadius: '16px', marginBottom: '2rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <h1 style={{ color: 'white', fontSize: '3rem' }}>{venue.name}</h1>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '2rem' }}>
        
        {/* Main Content */}
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
            <h1 style={{ margin: 0, fontSize: '2.5rem' }}>{venue.name}</h1>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', backgroundColor: '#FEF3C7', color: '#D97706', padding: '0.5rem 1rem', borderRadius: '8px', fontWeight: 'bold' }}>
              <Star fill="currentColor" size={20} /> 4.5
            </div>
          </div>
          
          <p className="text-muted" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '1.1rem', marginBottom: '2rem' }}>
            <MapPin size={20} /> {venue.location}
          </p>

          <div className="card" style={{ marginBottom: '2rem' }}>
            <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}><Info size={20} /> Description</h3>
            <p>{venue.description || 'A premium futsal experience.'}</p>
          </div>

          <div className="card" style={{ marginBottom: '2rem' }}>
            <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}><CheckCircle size={20} /> Amenities</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem' }}>
              {venue.amenities.map((item, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: 'var(--accent-color)' }}></div>
                  {item}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Booking Sidebar */}
        <div>
          <div className="card" style={{ position: 'sticky', top: '2rem', padding: '2rem' }}>
            <div style={{ textAlign: 'center', paddingBottom: '1.5rem', borderBottom: '1px solid var(--border-color)', marginBottom: '1.5rem' }}>
              <div style={{ fontSize: '2rem', fontWeight: 'bold', color: 'var(--primary-color)' }}>Rs. {venue.pricePerHour}</div>
              <div className="text-muted">per hour</div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
              <Clock size={20} color="var(--primary-color)" />
              <div>
                <div style={{ fontWeight: '600' }}>Opening Hours</div>
                <div className="text-muted">{venue.openTime} - {venue.closeTime}</div>
              </div>
            </div>

            <Link to={`/book/${venue._id}`} className="btn" style={{ width: '100%', textAlign: 'center', marginTop: '1.5rem', padding: '1rem', fontSize: '1.1rem' }}>
              Book a Slot
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
};

export default VenueDetail;
