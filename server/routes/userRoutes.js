const express = require('express');
const router = express.Router();

const {
  getUserProfile,
  updateUserProfile,
  getUserStats
} = require('../controllers/userController');

const {
  getUserWatchlist,
  addToWatchlist,
  removeFromWatchlist,
  checkWatchlistStatus
} = require('../controllers/watchListController');

const { authenticateToken, optionalAuth } = require('../middleware/authMiddleware');
const { validateUserUpdate } = require('../middleware/validationMiddleware');

// User profile routes
router.get('/:id', optionalAuth, getUserProfile);
router.put('/:id', authenticateToken, validateUserUpdate, updateUserProfile);
router.get('/:id/stats', getUserStats);

// Watchlist routes (all protected)
router.get('/:id/watchlist', authenticateToken, getUserWatchlist);
router.post('/:id/watchlist', authenticateToken, addToWatchlist);
router.delete('/:id/watchlist/:movieId', authenticateToken, removeFromWatchlist);
router.get('/:userId/watchlist/:movieId/status', authenticateToken, checkWatchlistStatus);

module.exports = router;