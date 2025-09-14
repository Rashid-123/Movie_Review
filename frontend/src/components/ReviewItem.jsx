import React from 'react';
import StarRating from './StarRating';

const ReviewItem = ({ 
  review, 
  currentUser, 
  onEdit, 
  onDelete, 
  isDeleting = false 
}) => {
  const isOwner = currentUser && review.userId._id === currentUser._id;
  const reviewDate = new Date(review.createdAt).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  return (
    <div className="border border-gray-300 p-6 mb-4 shadow shadow-sm">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          {review.userId.profilePicture ? (
            <img
              src={review.userId.profilePicture}
              alt={review.userId.username}
              className="w-10 h-10 rounded-full object-cover border border-gray-300"
            />
          ) : (
            <div className="w-10 h-10 rounded-full bg-gray-200 border border-gray-300 flex items-center justify-center">
              <span className="text-gray-600 font-medium">
                {review.userId.username.charAt(0).toUpperCase()}
              </span>
            </div>
          )}
          <div>
            <h4 className="font-medium text-gray-900">{review.userId.username}</h4>
            <p className="text-sm text-gray-500">{reviewDate}</p>
          </div>
        </div>
        
        {isOwner && (
       
        <div className="flex gap-2">
            <button
              onClick={() => onEdit(review)}
              className="px-3 py-1 text-sm text-blue-600 bg-blue-50 border border-blue-200 rounded-sm hover:bg-blue-100 hover:text-blue-700 hover:border-blue-300 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
            >
              Edit
            </button>
            <button
              onClick={() => onDelete(review._id)}
              disabled={isDeleting}
              className="px-3 py-1 text-sm text-red-600 bg-red-50 border border-red-200 rounded-sm hover:bg-red-100 hover:text-red-700 hover:border-red-300 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50 disabled:bg-gray-100 disabled:text-gray-400 disabled:border-gray-200 disabled:cursor-not-allowed disabled:hover:bg-gray-100 disabled:hover:text-gray-400"
            >
              {isDeleting ? 'Deleting...' : 'Delete'}
            </button>
          </div>
        )}
      </div>
      
      <div className="mb-3">
        <StarRating rating={review.rating} size="w-4 h-4" />
      </div>
      
      <p className="text-gray-700 leading-relaxed">{review.reviewText}</p>
      
      {review.updatedAt !== review.createdAt && (
        <p className="text-xs text-gray-500 mt-2 italic">
          Edited on {new Date(review.updatedAt).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
          })}
        </p>
      )}
    </div>
  );
};

export default ReviewItem;