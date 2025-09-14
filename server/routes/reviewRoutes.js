const express = require('express');
const router = express.Router();

const {
  getMovieReviews,
  createReview,
  updateReview,
  deleteReview,
  getUserReviews
} = require('../controllers/reviewController');

const { authenticateToken, optionalAuth } = require('../middleware/authMiddleware');
const { validateReview } = require('../middleware/validationMiddleware');

// Get reviews for a specific movie (public)
router.get('/movies/:id/reviews', optionalAuth, getMovieReviews);

// Create review for a movie (protected)
router.post('/movies/:id/reviews', authenticateToken, validateReview, createReview);

// Update/delete specific review (protected, own review only)
router.put('/reviews/:id', authenticateToken, validateReview, updateReview);
router.delete('/reviews/:id', authenticateToken, deleteReview);

// Get user's reviews
router.get('/users/:userId/reviews', getUserReviews);

module.exports = router;