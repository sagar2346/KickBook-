import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { User, LogOut, Map, Calendar, Settings } from 'lucide-react';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="navbar" style={{
      backgroundColor: 'var(--primary-color)',
      padding: '1rem 2rem',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      color: 'white',
      boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
    }}>
      <Link to="/" style={{ fontSize: '1.5rem', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        <div style={{
          background: 'var(--accent-color)',
          color: 'white',
          width: '32px',
          height: '32px',
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontWeight: 'bold'
        }}>
          K
        </div>
        KickBook
      </Link>

      <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
        <Link to="/venues" style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
          <Map size={18} /> Venues
        </Link>
        
        {user ? (
          <>
            <Link to="/my-bookings" style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
              <Calendar size={18} /> My Bookings
            </Link>
            {user.role === 'admin' && (
              <Link to="/admin" style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', color: 'var(--accent-color)' }}>
                <Settings size={18} /> Admin
              </Link>
            )}
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginLeft: '1rem', paddingLeft: '1rem', borderLeft: '1px solid rgba(255,255,255,0.2)' }}>
              <Link to="/profile" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <User size={18} /> {user.name.split(' ')[0]}
              </Link>
              <button onClick={handleLogout} style={{
                background: 'none',
                border: 'none',
                color: '#EF4444',
                display: 'flex',
                alignItems: 'center',
                gap: '0.25rem',
                cursor: 'pointer',
                fontWeight: '500'
              }}>
                <LogOut size={18} /> Logout
              </button>
            </div>
          </>
        ) : (
          <Link to="/login" className="btn" style={{ background: 'var(--accent-color)' }}>
            Login / Register
          </Link>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
