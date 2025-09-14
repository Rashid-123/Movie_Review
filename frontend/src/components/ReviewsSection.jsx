import React, { useState, useEffect } from 'react';
import ReviewForm from '../forms/ReviewForm';
import ReviewItem from './ReviewItem';
import { reviewAPI } from '../services/api';

const ReviewsSection = ({ movieId, currentUser }) => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [editingReview, setEditingReview] = useState(null);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    totalPages: 1,
    totalItems: 0,
    hasNext: false,
    hasPrev: false
  });
  const [userReview, setUserReview] = useState(null);
  const [deletingReviewId, setDeletingReviewId] = useState(null);

  useEffect(() => {
    fetchReviews();
  }, [movieId, pagination.page]);

  const fetchReviews = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await reviewAPI.getMovieReviews(movieId, {
        page: pagination.page,
        limit: pagination.limit,
        sortBy: 'createdAt',
        sortOrder: 'desc'
      });
      
      if (response.success) {
        setReviews(response.data);
        setPagination(response.pagination);
        
        console.log(response.data)
        // Find current user's review
        if (currentUser) {
          const userReviewFound = response.data.find(
           
            review => review.userId._id === currentUser._id
          );
          setUserReview(userReviewFound || null);
        }
      }
    } catch (error) {
      console.error('Error fetching reviews:', error);
      setError('Failed to load reviews');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateReview = async (reviewData) => {
    try {
      const response = await reviewAPI.createReview(movieId, reviewData);
      if (response.success) {
        setUserReview(response.data);
        setShowReviewForm(false);
        await fetchReviews(); // Refresh reviews
      }
    } catch (error) {
      console.error('Error creating review:', error);
      throw error;
    }
  };

  const handleUpdateReview = async (reviewData) => {
    try {
      const response = await reviewAPI.updateReview(editingReview._id, reviewData);
      if (response.success) {
        setUserReview(response.data);
        setEditingReview(null);
        await fetchReviews(); 
      }
    } catch (error) {
      console.error('Error updating review:', error);
      throw error;
    }
  };

  const handleDeleteReview = async (reviewId) => {
    if (!window.confirm('Are you sure you want to delete your review?')) {
      return;
    }

    try {
      setDeletingReviewId(reviewId);
      const response = await reviewAPI.deleteReview(reviewId);
      if (response.success) {
        setUserReview(null);
        await fetchReviews(); // Refresh reviews
      }
    } catch (error) {
      console.error('Error deleting review:', error);
      alert('Failed to delete review. Please try again.');
    } finally {
      setDeletingReviewId(null);
    }
  };

  const handleEditReview = (review) => {
    setEditingReview(review);
  };

  const handlePageChange = (newPage) => {
    setPagination(prev => ({ ...prev, page: newPage }));
  };

  if (loading) {
    return (
      <div className="border border-gray-300 p-8">
        <div className="flex items-center justify-center">
          <div className="text-gray-600">Loading reviews...</div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold">
          Reviews ({pagination.totalItems})
        </h2>
        
        {currentUser && !userReview && !showReviewForm && !editingReview && (
          <button
            onClick={() => setShowReviewForm(true)}
            className="px-4 py-2 bg-black text-white hover:bg-gray-800 transition-colors border border-black"
          >
            Write Review
          </button>
        )}
      </div>

      {error && (
        <div className="mb-6 p-4 border border-red-300 bg-red-50 text-red-700">
          {error}
        </div>
      )}

      {/* Review Form */}
      {showReviewForm && (
        <ReviewForm
          onSubmit={handleCreateReview}
          onCancel={() => setShowReviewForm(false)}
        />
      )}

      {/* Edit Review Form */}
      {editingReview && (
        <ReviewForm
          onSubmit={handleUpdateReview}
          onCancel={() => setEditingReview(null)}
          initialData={editingReview}
          isEditing={true}
        />
      )}

      {/* Reviews List */}
      {reviews.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          {currentUser ? 'No reviews yet. Be the first to review this movie!' : 'No reviews yet.'}
        </div>
      ) : (
        <div className="space-y-4">
          {reviews.map((review) => (
            <ReviewItem
              key={review._id}
              review={review}
              currentUser={currentUser}
              onEdit={handleEditReview}
              onDelete={handleDeleteReview}
              isDeleting={deletingReviewId === review._id}
            />
          ))}
        </div>
      )}

      {/* Pagination */}
      {pagination.totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 mt-8 pt-6 border-t border-gray-300">
          <button
            onClick={() => handlePageChange(pagination.page - 1)}
            disabled={!pagination.hasPrev}
            className="px-3 py-2 border border-gray-300 text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Previous
          </button>
          
          <div className="flex gap-1">
            {Array.from({ length: Math.min(5, pagination.totalPages) }, (_, i) => {
              const pageNum = i + 1;
              return (
                <button
                  key={pageNum}
                  onClick={() => handlePageChange(pageNum)}
                  className={`px-3 py-2 border ${
                    pageNum === pagination.page
                      ? 'bg-black text-white border-black'
                      : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  {pageNum}
                </button>
              );
            })}
          </div>
          
          <button
            onClick={() => handlePageChange(pagination.page + 1)}
            disabled={!pagination.hasNext}
            className="px-3 py-2 border border-gray-300 text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default ReviewsSection;