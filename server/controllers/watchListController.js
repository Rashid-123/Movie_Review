const Watchlist = require('../models/watchList');
const Movie = require('../models/movie');
const { successResponse, errorResponse, paginationResponse } = require('../utils/responseUtils');

// Get user's watchlist
const getUserWatchlist = async (req, res) => {
  try {
    const { id: userId } = req.params;
    const { page = 1, limit = 10, sortBy = 'createdAt', sortOrder = 'desc' } = req.query;

    // Check if user can access this watchlist
    if (req.user._id.toString() !== userId) {
      return errorResponse(res, 'You can only access your own watchlist', 403);
    }

    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const skip = (pageNum - 1) * limitNum;

    // Sort options
    const sortOptions = {};
    sortOptions[sortBy] = sortOrder === 'asc' ? 1 : -1;

    const [watchlistItems, totalCount] = await Promise.all([
      Watchlist.find({ userId })
        .populate('movieId')
        .sort(sortOptions)
        .skip(skip)
        .limit(limitNum)
        .lean(),
      Watchlist.countDocuments({ userId })
    ]);

    const totalPages = Math.ceil(totalCount / limitNum);
    const pagination = {
      page: pageNum,
      limit: limitNum,
      totalPages,
      totalItems: totalCount,
      hasNext: pageNum < totalPages,
      hasPrev: pageNum > 1
    };

    // Extract just the movie data with watchlist date
    const movies = watchlistItems.map(item => ({
      ...item.movieId,
      addedToWatchlistAt: item.createdAt
    }));

    paginationResponse(res, movies, pagination, 'Watchlist retrieved successfully');
  } catch (error) {
    console.error('Get user watchlist error:', error);
    errorResponse(res, 'Failed to retrieve watchlist', 500);
  }
};

// Add movie to user's watchlist
const addToWatchlist = async (req, res) => {
  try {
    const { id: userId } = req.params;
    const { movieId } = req.body;

    // Check if user can modify this watchlist
    if (req.user._id.toString() !== userId) {
      return errorResponse(res, 'You can only modify your own watchlist', 403);
    }

    // Check if movie exists
    const movie = await Movie.findById(movieId);
    if (!movie) {
      return errorResponse(res, 'Movie not found', 404);
    }

    // Check if already in watchlist
    const existingItem = await Watchlist.findOne({ userId, movieId });
    if (existingItem) {
      return errorResponse(res, 'Movie is already in your watchlist', 400);
    }

    // Add to watchlist
    const watchlistItem = await Watchlist.create({ userId, movieId });

    // Populate movie data for response
    const populatedItem = await Watchlist.findById(watchlistItem._id)
      .populate('movieId')
      .lean();

    successResponse(res, populatedItem, 'Movie added to watchlist successfully', 201);
  } catch (error) {
    console.error('Add to watchlist error:', error);
    errorResponse(res, 'Failed to add movie to watchlist', 500);
  }
};

// Remove movie from user's watchlist
const removeFromWatchlist = async (req, res) => {
  try {
    const { id: userId, movieId } = req.params;

    // Check if user can modify this watchlist
    if (req.user._id.toString() !== userId) {
      return errorResponse(res, 'You can only modify your own watchlist', 403);
    }

    // Find and remove the watchlist item
    const watchlistItem = await Watchlist.findOneAndDelete({ userId, movieId });
    if (!watchlistItem) {
      return errorResponse(res, 'Movie not found in your watchlist', 404);
    }

    successResponse(res, null, 'Movie removed from watchlist successfully');
  } catch (error) {
    console.error('Remove from watchlist error:', error);
    errorResponse(res, 'Failed to remove movie from watchlist', 500);
  }
};

// Check if movie is in user's watchlist
const checkWatchlistStatus = async (req, res) => {
  try {
    const { userId, movieId } = req.params;

    // Check if user can access this information
    if (req.user._id.toString() !== userId) {
      return errorResponse(res, 'You can only check your own watchlist status', 403);
    }

    const watchlistItem = await Watchlist.findOne({ userId, movieId });
    const isInWatchlist = !!watchlistItem;

    successResponse(res, { 
      isInWatchlist,
      addedAt: watchlistItem ? watchlistItem.createdAt : null
    }, 'Watchlist status retrieved successfully');
  } catch (error) {
    console.error('Check watchlist status error:', error);
    errorResponse(res, 'Failed to check watchlist status', 500);
  }
};

module.exports = {
  getUserWatchlist,
  addToWatchlist,
  removeFromWatchlist,
  checkWatchlistStatus
};