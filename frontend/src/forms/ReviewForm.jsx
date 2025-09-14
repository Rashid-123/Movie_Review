import React, { useState } from 'react';
import StarRating from '../components/StarRating';

const ReviewForm = ({ onSubmit, onCancel, initialData = null, isEditing = false }) => {
  const [rating, setRating] = useState(initialData?.rating || 0);
  const [reviewText, setReviewText] = useState(initialData?.reviewText || '');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (rating === 0 || reviewText.trim() === '') {
      alert('Please provide both rating and review text');
      return;
    }
    
    setIsSubmitting(true);
    try {
      await onSubmit({ rating, reviewText });
      if (!isEditing) {
        setRating(0);
        setReviewText('');
      }
    } catch (error) {
      console.error('Error submitting review:', error);
      alert('Failed to submit review. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="border border-gray-300 p-6 mb-6">
      <h3 className="text-lg font-semibold mb-4">
        {isEditing ? 'Edit Your Review' : 'Write a Review'}
      </h3>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Your Rating
          </label>
          <StarRating
            rating={rating}
            size="w-6 h-6"
            interactive={true}
            onRatingChange={setRating}
          />
        </div>
        
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Your Review
          </label>
          <textarea
            value={reviewText}
            onChange={(e) => setReviewText(e.target.value)}
            className="w-full border border-gray-300 px-3 py-2 focus:outline-none focus:border-black resize-none"
            rows="4"
            maxLength="1000"
            placeholder="Share your thoughts about this movie..."
            disabled={isSubmitting}
          />
          <div className="text-sm text-gray-500 mt-1">
            {reviewText.length}/1000 characters
          </div>
        </div>
        
        <div className="flex gap-3">
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-6 py-2 bg-black text-white hover:bg-gray-800 transition-colors border border-black disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            {isSubmitting ? 'Submitting...' : (isEditing ? 'Update Review' : 'Submit Review')}
          </button>
          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              disabled={isSubmitting}
              className="px-6 py-2 border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors disabled:cursor-not-allowed"
            >
              Cancel
            </button>
          )}
        </div>
      </form>
    </div>
  );
};

export default ReviewForm;