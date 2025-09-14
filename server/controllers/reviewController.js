
const Review = require('../models/review');
const Movie = require('../models/movie');
const { successResponse, errorResponse, paginationResponse } = require('../utils/responseUtils');

// Calculate and update movie average rating
const updateMovieRating = async (movieId) => {
  const reviews = await Review.find({ movieId });
  const totalReviews = reviews.length;
  const averageRating = totalReviews > 0 
    ? reviews.reduce((sum, review) => sum + review.rating, 0) / totalReviews 
    : 0;

  await Movie.findByIdAndUpdate(movieId, {
    averageRating: Math.round(averageRating * 10) / 10, // Round to 1 decimal place
    totalReviews
  });
};

// Get all reviews for a specific movie
const getMovieReviews = async (req, res) => {
  try {
    const { id: movieId } = req.params;
    const { page = 1, limit = 10, sortBy = 'createdAt', sortOrder = 'desc' } = req.query;

    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const skip = (pageNum - 1) * limitNum;

    // Check if movie exists
    const movie = await Movie.findById(movieId);
    if (!movie) {
      return errorResponse(res, 'Movie not found', 404);
    }

    // Sort options
    const sortOptions = {};
    sortOptions[sortBy] = sortOrder === 'asc' ? 1 : -1;

    const [reviews, totalCount] = await Promise.all([
      Review.find({ movieId })
        .populate('userId', 'username profilePicture')
        .sort(sortOptions)
        .skip(skip)
        .limit(limitNum)
        .lean(),
      Review.countDocuments({ movieId })
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

    paginationResponse(res, reviews, pagination, 'Reviews retrieved successfully');
  } catch (error) {
    console.error('Get movie reviews error:', error);
    errorResponse(res, 'Failed to retrieve reviews', 500);
  }
};

// Create new review for a movie
const createReview = async (req, res) => {
  try {
    const { id: movieId } = req.params;
    const { rating, reviewText } = req.body;
    const userId = req.user._id;

    // Check if movie exists
    const movie = await Movie.findById(movieId);
    if (!movie) {
      return errorResponse(res, 'Movie not found', 404);
    }

    // Check if user already reviewed this movie
    const existingReview = await Review.findOne({ userId, movieId });
    if (existingReview) {
      return errorResponse(res, 'You have already reviewed this movie', 400);
    }

    // Create review
    const review = await Review.create({
      userId,
      movieId,
      rating,
      reviewText
    });

    // Update movie average rating
    await updateMovieRating(movieId);

    // Populate user data for response
    const populatedReview = await Review.findById(review._id)
      .populate('userId', 'username profilePicture')
      .lean();

    successResponse(res, populatedReview, 'Review created successfully', 201);
  } catch (error) {
    console.error('Create review error:', error);
    errorResponse(res, 'Failed to create review', 500);
  }
};

// Update user's own review
const updateReview = async (req, res) => {
  try {
    const { id: reviewId } = req.params;
    const { rating, reviewText } = req.body;
    const userId = req.user._id;

    // Find review and check ownership
    const review = await Review.findById(reviewId);
    if (!review) {
      return errorResponse(res, 'Review not found', 404);
    }

    if (review.userId.toString() !== userId.toString()) {
      return errorResponse(res, 'You can only update your own reviews', 403);
    }

    // Update review
    const updatedReview = await Review.findByIdAndUpdate(
      reviewId,
      { rating, reviewText },
      { new: true, runValidators: true }
    ).populate('userId', 'username profilePicture');

    // Update movie average rating
    await updateMovieRating(review.movieId);

    successResponse(res, updatedReview, 'Review updated successfully');
  } catch (error) {
    console.error('Update review error:', error);
    errorResponse(res, 'Failed to update review', 500);
  }
};

// Delete user's own review
const deleteReview = async (req, res) => {
  try {
    const { id: reviewId } = req.params;
    const userId = req.user._id;

    // Find review and check ownership
    const review = await Review.findById(reviewId);
    if (!review) {
      return errorResponse(res, 'Review not found', 404);
    }

    if (review.userId.toString() !== userId.toString()) {
      return errorResponse(res, 'You can only delete your own reviews', 403);
    }

    const movieId = review.movieId;

    // Delete review
    await Review.findByIdAndDelete(reviewId);

    // Update movie average rating
    await updateMovieRating(movieId);

    successResponse(res, null, 'Review deleted successfully');
  } catch (error) {
    console.error('Delete review error:', error);
    errorResponse(res, 'Failed to delete review', 500);
  }
};

// Get all reviews by a specific user
const getUserReviews = async (req, res) => {
  try {
    const { userId } = req.params;
    const { page = 1, limit = 10, sortBy = 'createdAt', sortOrder = 'desc' } = req.query;

    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const skip = (pageNum - 1) * limitNum;

    // Sort options
    const sortOptions = {};
    sortOptions[sortBy] = sortOrder === 'asc' ? 1 : -1;

    const [reviews, totalCount] = await Promise.all([
      Review.find({ userId })
        .populate('movieId', 'title posterUrl')
        .sort(sortOptions)
        .skip(skip)
        .limit(limitNum)
        .lean(),
      Review.countDocuments({ userId })
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

    paginationResponse(res, reviews, pagination, 'User reviews retrieved successfully');
  } catch (error) {
    console.error('Get user reviews error:', error);
    errorResponse(res, 'Failed to retrieve user reviews', 500);
  }
};

module.exports = {
  getMovieReviews,
  createReview,
  updateReview,
  deleteReview,
  getUserReviews
};