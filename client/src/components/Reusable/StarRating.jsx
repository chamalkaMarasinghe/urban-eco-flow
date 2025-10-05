import React from 'react';
import { Star, StarHalf } from 'lucide-react';

const StarRating = ({ rating = 0, size = 20, loading=  false }) => {
  // Convert rating to number and ensure it's between 0 and 5
  const numRating = Math.min(Math.max(Number(rating), 0), 5);
  
  // Calculate full and partial stars
  const fullStars = Math.floor(numRating);
  const hasHalfStar = numRating % 1 >= 0.5;
  const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

  if(loading){
    return (
      <div className="flex gap-1.5 rounded-xl text-transparent bg-slate-300 animate-pulse">
        loading star rating
      </div>
    );
  }
  
  return (
    <div className="flex gap-1.5">
      {/* Full stars */}
      {[...Array(fullStars)].map((_, index) => (
        <Star
          key={`full-${index}`}
          size={size}
          className="fill-yellow-300 text-yellow-300"
        />
      ))}
      
      {/* Half star */}
      {hasHalfStar && (
        <StarHalf
          size={size}
          className="fill-yellow-300 text-yellow-300"
        />
      )}
      
      {/* Empty stars */}
      {[...Array(emptyStars)].map((_, index) => (
        <Star
          key={`empty-${index}`}
          size={size}
          className="text-yellow-300"
        />
      ))}
    </div>
  );
};

export default StarRating;