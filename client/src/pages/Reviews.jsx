import React, { useState, useEffect, useContext } from 'react';
import { useParams, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { Star, MessageSquare } from 'lucide-react';
import api from '../utils/api';

const Reviews = () => {
  const { venueId } = useParams();
  const { user } = useContext(AuthContext);
  
  const [reviews, setReviews] = useState([]);
  const [averageRating, setAverageRating] = useState(0);
  const [venue, setVenue] = useState(null);
  const [loading, setLoading] = useState(true);

  // Form state
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [submitError, setSubmitError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchData();
  }, [venueId]);

  const fetchData = async () => {
    try {
      const [reviewsRes, venueRes] = await Promise.all([
        api.get(`/reviews/venue/${venueId}`),
        api.get(`/venues/${venueId}`)
      ]);
      setReviews(reviewsRes.data.reviews);
      setAverageRating(reviewsRes.data.averageRating);
      setVenue(venueRes.data.venue);
    } catch (error) {
      console.error('Error fetching reviews:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitError('');
    setSubmitting(true);
    try {
      await api.post('/reviews', { venueId, rating, comment });
      setComment('');
      fetchData(); // Refresh reviews
    } catch (error) {
      setSubmitError(error.response?.data?.message || 'Failed to submit review');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <div>Loading reviews...</div>;

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', animation: 'fadeIn 0.3s ease-out' }}>
      <Link to={`/venues/${venueId}`} className="btn" style={{ marginBottom: '2rem', display: 'inline-block' }}>
        Back to Venue
      </Link>

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2rem' }}>
        <div>
          <h1 style={{ margin: 0 }}>Reviews for {venue?.name}</h1>
          <p className="text-muted">{reviews.length} total reviews</p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', backgroundColor: '#FEF3C7', color: '#D97706', padding: '1rem', borderRadius: '12px', fontSize: '1.5rem', fontWeight: 'bold' }}>
          <Star fill="currentColor" size={28} /> {averageRating}
        </div>
      </div>

      {user && (
        <div className="card" style={{ marginBottom: '3rem', padding: '2rem' }}>
          <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem' }}>
            <MessageSquare size={20} /> Write a Review
          </h3>
          
          {submitError && <div style={{ color: 'var(--status-cancelled)', marginBottom: '1rem' }}>{submitError}</div>}
          
          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>Rating (1-5)</label>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                {[1, 2, 3, 4, 5].map(num => (
                  <button
                    type="button"
                    key={num}
                    onClick={() => setRating(num)}
                    style={{ background: 'none', border: 'none', cursor: 'pointer', color: num <= rating ? '#F59E0B' : '#E5E7EB' }}
                  >
                    <Star fill="currentColor" size={32} />
                  </button>
                ))}
              </div>
            </div>

            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>Your Review</label>
              <textarea 
                required
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Share your experience playing here..."
                style={{ width: '100%', padding: '1rem', borderRadius: '4px', border: '1px solid var(--border-color)', minHeight: '120px', resize: 'vertical' }}
              />
            </div>

            <button type="submit" className="btn" disabled={submitting}>
              {submitting ? 'Submitting...' : 'Submit Review'}
            </button>
          </form>
        </div>
      )}

      <div>
        {reviews.length === 0 ? (
          <div className="card text-center" style={{ padding: '3rem' }}>
            No reviews yet. Be the first to review!
          </div>
        ) : (
          <div style={{ display: 'grid', gap: '1.5rem' }}>
            {reviews.map(review => (
              <div key={review._id} className="card">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <div style={{ width: '40px', height: '40px', borderRadius: '50%', backgroundColor: 'var(--primary-color)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>
                      {review.userId?.name?.charAt(0) || 'U'}
                    </div>
                    <div>
                      <div style={{ fontWeight: '600' }}>{review.userId?.name || 'Unknown User'}</div>
                      <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{new Date(review.createdAt).toLocaleDateString()}</div>
                    </div>
                  </div>
                  <div style={{ display: 'flex', color: '#F59E0B' }}>
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} size={16} fill={i < review.rating ? "currentColor" : "none"} color={i < review.rating ? "#F59E0B" : "#E5E7EB"} />
                    ))}
                  </div>
                </div>
                <p style={{ margin: 0 }}>{review.comment}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Reviews;
