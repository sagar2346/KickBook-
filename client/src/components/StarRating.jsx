import React, { useState } from 'react';
import { Star } from 'lucide-react';

const StarRating = ({ rating = 0, onRatingChange = null, size = 18, editable = false }) => {
  const [hoverRating, setHoverRating] = useState(0);

  const handleClick = (index) => {
    if (editable && onRatingChange) {
      onRatingChange(index);
    }
  };

  const handleMouseEnter = (index) => {
    if (editable) {
      setHoverRating(index);
    }
  };

  const handleMouseLeave = () => {
    if (editable) {
      setHoverRating(0);
    }
  };

  return (
    <div className="star-rating-container" onMouseLeave={handleMouseLeave}>
      {[1, 2, 3, 4, 5].map((index) => {
        const isFilled = editable
          ? (hoverRating || rating) >= index
          : rating >= index;

        return (
          <button
            key={index}
            type="button"
            className={`star-button ${editable ? 'editable' : ''}`}
            onClick={() => handleClick(index)}
            onMouseEnter={() => handleMouseEnter(index)}
            disabled={!editable}
            style={{
              background: 'none',
              border: 'none',
              padding: 0,
              margin: '0 2px',
              cursor: editable ? 'pointer' : 'default',
              display: 'inline-flex'
            }}
          >
            <Star
              size={size}
              fill={isFilled ? '#F59E0B' : 'transparent'}
              color={isFilled ? '#F59E0B' : '#D1D5DB'}
              style={{
                transition: 'all 0.15s ease'
              }}
            />
          </button>
        );
      })}
    </div>
  );
};

export default StarRating;
