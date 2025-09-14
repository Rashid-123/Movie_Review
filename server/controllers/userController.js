const User = require('../models/user');
const Review = require('../models/review');
const Watchlist = require('../models/watchList');
const { successResponse, errorResponse } = require('../utils/responseUtils');

// Get user profile and review history
const getUserProfile = async (req, res) => {
  try {
    const { id: userId } = req.params;

    // Find user
    const user = await User.findById(userId).select('-password');
    if (!user) {
      return errorResponse(res, 'User not found', 404);
    }

    // Get user statistics
    const [reviewCount, watchlistCount, recentReviews] = await Promise.all([
      Review.countDocuments({ userId }),
      Watchlist.countDocuments({ userId }),
      Review.find({ userId })
        .populate('movieId', 'title posterUrl')
        .sort({ createdAt: -1 })
        .limit(5)
        .lean()
    ]);

    const userProfile = {
      user,
      stats: {
        totalReviews: reviewCount,
        watchlistCount
      },
      recentReviews
    };

    successResponse(res, userProfile, 'User profile retrieved successfully');
  } catch (error) {
    console.error('Get user profile error:', error);
    errorResponse(res, 'Failed to retrieve user profile', 500);
  }
};

// Update user profile
const updateUserProfile = async (req, res) => {
  try {
    const { id: userId } = req.params;
    const { username, email, profilePicture } = req.body;

    // Check if user can update this profile
    if (req.user._id.toString() !== userId) {
      return errorResponse(res, 'You can only update your own profile', 403);
    }

    // Check if username or email already exists (excluding current user)
    if (username || email) {
      const existingUser = await User.findOne({
        _id: { $ne: userId },
        $or: [
          ...(username ? [{ username }] : []),
          ...(email ? [{ email }] : [])
        ]
      });

      if (existingUser) {
        const field = existingUser.username === username ? 'username' : 'email';
        return errorResponse(res, `This ${field} is already taken`, 400);
      }
    }

    // Update user
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { 
        ...(username && { username }),
        ...(email && { email }),
        ...(profilePicture !== undefined && { profilePicture })
      },
      { new: true, runValidators: true }
    ).select('-password');

    if (!updatedUser) {
      return errorResponse(res, 'User not found', 404);
    }

    successResponse(res, updatedUser, 'Profile updated successfully');
  } catch (error) {
    console.error('Update user profile error:', error);
    errorResponse(res, 'Failed to update profile', 500);
  }
};

// Get user statistics
const getUserStats = async (req, res) => {
  try {
    const { id: userId } = req.params;

    // Check if user exists
    const user = await User.findById(userId);
    if (!user) {
      return errorResponse(res, 'User not found', 404);
    }

    const [
      totalReviews,
      watchlistCount,
      averageRating,
      reviewsByRating,
      genrePreferences
    ] = await Promise.all([
      // Total reviews count
      Review.countDocuments({ userId }),
      
      // Watchlist count
      Watchlist.countDocuments({ userId }),
      
      // Average rating given by user
      Review.aggregate([
        { $match: { userId: user._id } },
        { $group: { _id: null, avgRating: { $avg: '$rating' } } }
      ]),
      
      // Count of reviews by rating
      Review.aggregate([
        { $match: { userId: user._id } },
        { $group: { _id: '$rating', count: { $sum: 1 } } },
        { $sort: { _id: 1 } }
      ]),
      
      // Genre preferences based on reviewed movies
      Review.aggregate([
        { $match: { userId: user._id } },
        { $lookup: { from: 'movies', localField: 'movieId', foreignField: '_id', as: 'movie' } },
        { $unwind: '$movie' },
        { $unwind: '$movie.genres' },
        { $group: { _id: '$movie.genres', count: { $sum: 1 } } },
        { $sort: { count: -1 } },
        { $limit: 5 }
      ])
    ]);

    const stats = {
      totalReviews,
      watchlistCount,
      averageRating: averageRating.length > 0 ? Math.round(averageRating[0].avgRating * 10) / 10 : 0,
      reviewsByRating: reviewsByRating.reduce((acc, item) => {
        acc[item._id] = item.count;
        return acc;
      }, {}),
      topGenres: genrePreferences.map(genre => ({
        name: genre._id,
        count: genre.count
      }))
    };

    successResponse(res, stats, 'User statistics retrieved successfully');
  } catch (error) {
    console.error('Get user stats error:', error);
    errorResponse(res, 'Failed to retrieve user statistics', 500);
  }
};

module.exports = {
  getUserProfile,
  updateUserProfile,
  getUserStats
};