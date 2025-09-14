const express = require('express');
const router = express.Router();

const {
  getAllMovies,
  getMovieById,
  createMovie,
  updateMovie,
  deleteMovie,
  getMoviesByGenre,
  getFeaturedMovies
} = require('../controllers/movieController');

const { authenticateToken, requireAdmin, optionalAuth } = require('../middleware/authMiddleware');
const { validateMovie } = require('../middleware/validationMiddleware');

// Public routes
router.get('/', optionalAuth, getAllMovies);
router.get('/featured', getFeaturedMovies);
router.get('/genre/:genre', getMoviesByGenre);
router.get('/:id', optionalAuth, getMovieById);

// Admin only routes
router.post('/', authenticateToken, requireAdmin, validateMovie, createMovie);
router.put('/:id', authenticateToken, requireAdmin, validateMovie, updateMovie);
router.delete('/:id', authenticateToken, requireAdmin, deleteMovie);

module.exports = router;