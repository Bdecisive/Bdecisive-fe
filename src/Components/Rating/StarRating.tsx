import React, { useState } from 'react';
import { Star } from 'lucide-react';

interface StarRatingProps {
  value: number;
  onChange?: (rating: number) => void;
  size?: number;
  readOnly?: boolean;
}

const StarRating: React.FC<StarRatingProps> = ({ 
  value, 
  onChange, 
  size = 24,
  readOnly = false 
}) => {
  const [hoverRating, setHoverRating] = useState(0);

  // Generate array of 5 stars
  const stars = Array(5).fill(0);

  const handleMouseOver = (rating: number) => {
    if (!readOnly) {
      setHoverRating(rating);
    }
  };

  const handleMouseLeave = () => {
    setHoverRating(0);
  };

  const handleClick = (rating: number) => {
    if (!readOnly && onChange) {
      onChange(rating);
    }
  };

  // Function to determine star fill percentage
  const getFillPercentage = (index: number) => {
    const rating = hoverRating || value;
    if (index + 1 <= rating) return 100;
    if (Math.ceil(rating) === index + 1) {
      return (rating % 1) * 100;
    }
    return 0;
  };

  return (
    <div 
      className="flex gap-1" 
      onMouseLeave={handleMouseLeave}
      style={{ cursor: readOnly ? 'default' : 'pointer' }}
    >
      {stars.map((_, index) => (
        <div
          key={index}
          className="relative"
          onMouseOver={() => handleMouseOver(index + 1)}
          onClick={() => handleClick(index + 1)}
        >
          {/* Background star (empty) */}
          <Star
            size={size}
            className="text-gray-300"
            fill="rgb(209 213 219)"
          />
          
          {/* Foreground star (filled) */}
          <div
            className="absolute top-0 left-0 overflow-hidden"
            style={{ width: `${getFillPercentage(index)}%` }}
          >
            <Star
              size={size}
              className="text-yellow-400"
              fill="rgb(250 204 21)"
            />
          </div>
        </div>
      ))}
    </div>
  );
};

export default StarRating;