import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Search, MapPin, Filter, Star } from 'lucide-react';
import api from '../utils/api';

const AllVenues = () => {
  const [venues, setVenues] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const location = useLocation();
  const navigate = useNavigate();
  const searchParams = new URLSearchParams(location.search);
  
  const [filters, setFilters] = useState({
    search: searchParams.get('search') || '',
    location: searchParams.get('location') || 'All',
    maxPrice: searchParams.get('maxPrice') || ''
  });

  const locations = ['All', 'Kathmandu', 'Lalitpur', 'Pokhara', 'Bhaktapur'];

  useEffect(() => {
    fetchVenues();
  }, [location.search]);

  const fetchVenues = async () => {
    setLoading(true);
    try {
      const qs = new URLSearchParams(filters).toString();
      const res = await api.get(`/venues?${qs}`);
      setVenues(res.data.venues);
    } catch (error) {
      console.error('Error fetching venues:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const applyFilters = (e) => {
    e.preventDefault();
    const qs = new URLSearchParams();
    if (filters.search) qs.append('search', filters.search);
    if (filters.location !== 'All') qs.append('location', filters.location);
    if (filters.maxPrice) qs.append('maxPrice', filters.maxPrice);
    navigate(`/venues?${qs.toString()}`);
  };

  return (
    <div style={{ animation: 'fadeIn 0.3s ease-out' }}>
      <h1 style={{ marginBottom: '2rem' }}>All Futsal Venues</h1>
      
      <div style={{ display: 'flex', gap: '2rem', alignItems: 'flex-start' }}>
        
        {/* Filters Sidebar */}
        <div className="card" style={{ width: '300px', flexShrink: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '1rem' }}>
            <Filter size={20} />
            <h3 style={{ margin: 0 }}>Filters</h3>
          </div>
          
          <form onSubmit={applyFilters}>
            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>Search Name</label>
              <div style={{ position: 'relative' }}>
                <Search size={16} color="var(--text-muted)" style={{ position: 'absolute', left: '10px', top: '12px' }} />
                <input 
                  type="text" 
                  name="search"
                  value={filters.search}
                  onChange={handleFilterChange}
                  placeholder="e.g. Kathmandu Futsal" 
                  style={{ width: '100%', padding: '0.6rem 0.6rem 0.6rem 2rem', borderRadius: '4px', border: '1px solid var(--border-color)' }}
                />
              </div>
            </div>

            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>Location</label>
              <select 
                name="location"
                value={filters.location}
                onChange={handleFilterChange}
                style={{ width: '100%', padding: '0.6rem', borderRadius: '4px', border: '1px solid var(--border-color)' }}
              >
                {locations.map(loc => (
                  <option key={loc} value={loc}>{loc}</option>
                ))}
              </select>
            </div>

            <div style={{ marginBottom: '2rem' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>Max Price (Rs. / hr)</label>
              <input 
                type="number" 
                name="maxPrice"
                value={filters.maxPrice}
                onChange={handleFilterChange}
                placeholder="e.g. 2000" 
                style={{ width: '100%', padding: '0.6rem', borderRadius: '4px', border: '1px solid var(--border-color)' }}
              />
            </div>

            <button type="submit" className="btn" style={{ width: '100%' }}>Apply Filters</button>
          </form>
        </div>

        {/* Venues Grid */}
        <div style={{ flex: 1 }}>
          {loading ? (
            <div>Loading venues...</div>
          ) : venues.length === 0 ? (
            <div className="card text-center" style={{ padding: '3rem' }}>
              <h3>No venues found matching your criteria.</h3>
              <p className="text-muted">Try adjusting your filters.</p>
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1.5rem' }}>
              {venues.map(venue => (
                <div key={venue._id} className="card" style={{ padding: '0', overflow: 'hidden', transition: 'all 0.3s' }}>
                  <div style={{ height: '180px', backgroundColor: '#e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <MapPin size={40} color="var(--text-muted)" />
                  </div>
                  <div style={{ padding: '1.5rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <h3 style={{ fontSize: '1.2rem', margin: 0 }}>{venue.name}</h3>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', color: '#F59E0B', fontWeight: '600', fontSize: '0.9rem' }}>
                        <Star size={14} fill="currentColor" /> 4.5
                      </div>
                    </div>
                    <p className="text-muted" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', margin: '0.5rem 0', fontSize: '0.9rem' }}>
                      <MapPin size={14} /> {venue.location}
                    </p>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '1rem' }}>
                      {venue.amenities.slice(0, 2).map((amenity, i) => (
                        <span key={i} style={{ backgroundColor: 'var(--card-bg)', border: '1px solid var(--border-color)', padding: '0.2rem 0.5rem', borderRadius: '12px', fontSize: '0.75rem' }}>
                          {amenity}
                        </span>
                      ))}
                      {venue.amenities.length > 2 && <span style={{ fontSize: '0.75rem', alignSelf: 'center' }}>+{venue.amenities.length - 2} more</span>}
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid var(--border-color)', paddingTop: '1rem' }}>
                      <div style={{ color: 'var(--primary-color)', fontWeight: 'bold' }}>Rs. {venue.pricePerHour}<span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 'normal' }}>/hr</span></div>
                      <Link to={`/venues/${venue._id}`} className="btn" style={{ padding: '0.4rem 1rem', fontSize: '0.9rem' }}>Details</Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

export default AllVenues;
