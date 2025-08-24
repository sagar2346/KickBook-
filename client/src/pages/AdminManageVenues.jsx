import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2 } from 'lucide-react';
import api from '../utils/api';

const AdminManageVenues = () => {
  const [venues, setVenues] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchVenues();
  }, []);

  const fetchVenues = async () => {
    try {
      const res = await api.get('/venues');
      setVenues(res.data.venues);
    } catch (error) {
      console.error('Failed to fetch venues');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this venue?')) {
      try {
        await api.delete(`/venues/${id}`);
        setVenues(venues.filter(v => v._id !== id));
      } catch (error) {
        alert('Failed to delete venue');
      }
    }
  };

  return (
    <div style={{ animation: 'fadeIn 0.3s ease-out' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h1 style={{ margin: 0 }}>Manage Venues</h1>
        <button className="btn" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', backgroundColor: 'var(--status-confirmed)' }}>
          <Plus size={18} /> Add Venue
        </button>
      </div>

      <div className="card" style={{ padding: 0, overflowX: 'auto' }}>
        {loading ? (
          <div style={{ padding: '2rem', textAlign: 'center' }}>Loading venues...</div>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ backgroundColor: '#F3F4F6', borderBottom: '1px solid var(--border-color)' }}>
                <th style={{ padding: '1rem' }}>Name</th>
                <th style={{ padding: '1rem' }}>Location</th>
                <th style={{ padding: '1rem' }}>Price/Hr</th>
                <th style={{ padding: '1rem', textAlign: 'center' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {venues.map(venue => (
                <tr key={venue._id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                  <td style={{ padding: '1rem', fontWeight: '500' }}>{venue.name}</td>
                  <td style={{ padding: '1rem', color: 'var(--text-muted)' }}>{venue.location}</td>
                  <td style={{ padding: '1rem' }}>Rs. {venue.pricePerHour}</td>
                  <td style={{ padding: '1rem', textAlign: 'center' }}>
                    <button style={{ background: 'none', border: 'none', color: '#3B82F6', marginRight: '1rem', cursor: 'pointer' }}>
                      <Edit size={18} />
                    </button>
                    <button 
                      onClick={() => handleDelete(venue._id)}
                      style={{ background: 'none', border: 'none', color: 'var(--status-cancelled)', cursor: 'pointer' }}
                    >
                      <Trash2 size={18} />
                    </button>
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

export default AdminManageVenues;
