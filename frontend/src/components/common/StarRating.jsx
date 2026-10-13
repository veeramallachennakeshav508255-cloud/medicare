import React from 'react';
import { Star } from 'lucide-react';

const StarRating = ({ rating = 5, totalStars = 5, size = 16, showNumber = true, reviewCount = null }) => {
  return (
    <div style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
      <div style={{ display: 'inline-flex', gap: '2px', color: '#f59e0b' }}>
        {[...Array(totalStars)].map((_, i) => {
          const filled = i < Math.floor(rating);
          const half = !filled && i < rating;
          return (
            <Star
              key={i}
              size={size}
              fill={filled ? '#f59e0b' : half ? '#fde68a' : 'none'}
              stroke="#f59e0b"
              strokeWidth={1.5}
            />
          );
        })}
      </div>
      {showNumber && (
        <span style={{ fontWeight: 700, fontSize: '0.86rem', color: '#0f172a', marginLeft: '4px' }}>
          {rating.toFixed(1)}
        </span>
      )}
      {reviewCount !== null && (
        <span style={{ fontSize: '0.8rem', color: '#64748b' }}>
          ({reviewCount} reviews)
        </span>
      )}
    </div>
  );
};

export default StarRating;
