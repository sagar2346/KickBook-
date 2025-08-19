import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, MapPin, Star, ArrowRight } from 'lucide-react';
import api from '../utils/api';

const Home = () => {
  const [venues, setVenues] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchVenues = async () => {
      try {
        const res = await api.get('/venues?limit=3');
        setVenues(res.data.venues.slice(0, 3));
      } catch (error) {
        console.error('Failed to fetch venues');
      } finally {
        setLoading(false);
      }
    };
    fetchVenues();
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/venues?search=${encodeURIComponent(searchQuery)}`);
    }
  };

  return (
    <div style={{ animation: 'fadeIn 0.5s ease-out' }}>
      {/* Hero Section */}
      <section style={{
        background: 'linear-gradient(135deg, var(--primary-color) 0%, #2A5298 100%)',
        color: 'white',
        padding: '5rem 2rem',
        borderRadius: '16px',
        textAlign: 'center',
        marginBottom: '4rem',
        boxShadow: '0 10px 25px rgba(30, 58, 95, 0.2)'
      }}>
        <h1 style={{ fontSize: '3.5rem', marginBottom: '1rem', color: 'white' }}>
          Find & Book the Best <span style={{ color: 'var(--accent-color)' }}>Futsal</span> Venues
        </h1>
        <p style={{ fontSize: '1.2rem', marginBottom: '2.5rem', opacity: '0.9', maxWidth: '600px', margin: '0 auto 2.5rem' }}>
          Discover top-rated futsal grounds in Kathmandu, Lalitpur, and Pokhara. Book instantly with zero hassle.
        </p>

        <form onSubmit={handleSearch} style={{
          display: 'flex',
          maxWidth: '600px',
          margin: '0 auto',
          background: 'white',
          padding: '0.5rem',
          borderRadius: '8px',
          boxShadow: '0 4px 15px rgba(0,0,0,0.1)'
        }}>
          <div style={{ flex: 1, display: 'flex', alignItems: 'center', padding: '0 1rem' }}>
            <Search color="var(--text-muted)" size={20} />
            <input 
              type="text" 
              placeholder="Search by venue name or location..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                border: 'none',
                outline: 'none',
                padding: '0.8rem',
                width: '100%',
                fontSize: '1rem',
                color: 'var(--text-color)'
              }}
            />
          </div>
          <button type="submit" className="btn" style={{ padding: '0.8rem 2rem', fontSize: '1rem' }}>
            Search
          </button>
        </form>
      </section>

      {/* Featured Venues */}
      <section style={{ marginBottom: '4rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '2rem' }}>
          <div>
            <h2 style={{ fontSize: '2rem' }}>Popular Venues</h2>
            <p className="text-muted">Top-rated futsal grounds near you</p>
          </div>
          <Link to="/venues" style={{ color: 'var(--primary-color)', fontWeight: '500', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            View All <ArrowRight size={16} />
          </Link>
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '3rem' }}>Loading venues...</div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '2rem' }}>
            {venues.map(venue => (
              <div key={venue._id} className="card" style={{ padding: '0', overflow: 'hidden', transition: 'transform 0.3s ease, box-shadow 0.3s ease', cursor: 'pointer' }}
                   onMouseOver={e => { e.currentTarget.style.transform = 'translateY(-5px)'; e.currentTarget.style.boxShadow = '0 10px 20px rgba(0,0,0,0.1)'; }}
                   onMouseOut={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 2px 5px rgba(0,0,0,0.05)'; }}>
                
                <div style={{ height: '200px', backgroundColor: '#e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  {/* Placeholder for venue photo */}
                  <MapPin size={40} color="var(--text-muted)" />
                </div>
                
                <div style={{ padding: '1.5rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                    <h3 style={{ fontSize: '1.25rem', margin: 0 }}>{venue.name}</h3>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', color: '#F59E0B', fontWeight: '600' }}>
                      <Star size={16} fill="currentColor" /> 4.5
                    </div>
                  </div>
                  
                  <p className="text-muted" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem', fontSize: '0.9rem' }}>
                    <MapPin size={16} /> {venue.location}
                  </p>
                  
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '1.5rem', paddingTop: '1rem', borderTop: '1px solid var(--border-color)' }}>
                    <div>
                      <span style={{ fontSize: '1.25rem', fontWeight: 'bold', color: 'var(--primary-color)' }}>Rs. {venue.pricePerHour}</span>
                      <span className="text-muted" style={{ fontSize: '0.85rem' }}> / hr</span>
                    </div>
                    <Link to={`/venues/${venue._id}`} className="btn" style={{ padding: '0.5rem 1rem', fontSize: '0.9rem' }}>
                      Book Now
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default Home;
