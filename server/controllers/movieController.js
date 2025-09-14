const Movie = require('../models/movie');
const { successResponse, errorResponse, paginationResponse } = require('../utils/responseUtils');

// Get all movies with pagination, search, and filtering
const getAllMovies = async (req, res) => {
  try {
    console.log("1 ")
    const {
      page = 1,
      limit = 10,
      search = '',
      genre = '',
      year = '',
      minRating = '',
      maxRating = '',
      sortBy = 'createdAt',
      sortOrder = 'desc'
    } = req.query;

    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const skip = (pageNum - 1) * limitNum;
    console.log("2 ")

    // Build query
    let query = {};

    // Search functionality
    if (search) {
      query.$text = { $search: search };
    }

    // Filter by genre
    if (genre) {
      query.genres = { $in: [genre] };
    }

    // Filter by year
    if (year) {
      query.releaseYear = year;
    }

    // Filter by rating range
    if (minRating || maxRating) {
      query.averageRating = {};
      if (minRating) query.averageRating.$gte = parseFloat(minRating);
      if (maxRating) query.averageRating.$lte = parseFloat(maxRating);
    }

    // Sort options
    const sortOptions = {};
    sortOptions[sortBy] = sortOrder === 'asc' ? 1 : -1;

    // Execute query
    const [movies, totalCount] = await Promise.all([
      Movie.find(query)
        .sort(sortOptions)
        .skip(skip)
        .limit(limitNum)
        .lean(),
      Movie.countDocuments(query)
    ]);

    const totalPages = Math.ceil(totalCount / limitNum);
    const hasNext = pageNum < totalPages;
    const hasPrev = pageNum > 1;

    const pagination = {
      page: pageNum,
      limit: limitNum,
      totalPages,
      totalItems: totalCount,
      hasNext,
      hasPrev
    };

    paginationResponse(res, movies, pagination, 'Movies retrieved successfully');
  } catch (error) {
    console.error('Get all movies error:', error);
    errorResponse(res, 'Failed to retrieve movies', 500);
  }
};

// Get movie by ID
const getMovieById = async (req, res) => {
  try {
    const { id } = req.params;
    
    const movie = await Movie.findById(id);
    if (!movie) {
      return errorResponse(res, 'Movie not found', 404);
    }

    successResponse(res, movie, 'Movie retrieved successfully');
  } catch (error) {
    console.error('Get movie by ID error:', error);
    errorResponse(res, 'Failed to retrieve movie', 500);
  }
};

// Create new movie (admin only)
const createMovie = async (req, res) => {
  try {
    const movieData = req.body;
    
    const movie = await Movie.create(movieData);
    
    successResponse(res, movie, 'Movie created successfully', 201);
  } catch (error) {
    console.error('Create movie error:', error);
    errorResponse(res, 'Failed to create movie', 500);
  }
};

// Update movie (admin only)
const updateMovie = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    const movie = await Movie.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    );

    if (!movie) {
      return errorResponse(res, 'Movie not found', 404);
    }

    successResponse(res, movie, 'Movie updated successfully');
  } catch (error) {
    console.error('Update movie error:', error);
    errorResponse(res, 'Failed to update movie', 500);
  }
};

// Delete movie (admin only)
const deleteMovie = async (req, res) => {
  try {
    const { id } = req.params;

    const movie = await Movie.findByIdAndDelete(id);
    if (!movie) {
      return errorResponse(res, 'Movie not found', 404);
    }

    successResponse(res, null, 'Movie deleted successfully');
  } catch (error) {
    console.error('Delete movie error:', error);
    errorResponse(res, 'Failed to delete movie', 500);
  }
};

// Get movies by genre
const getMoviesByGenre = async (req, res) => {
  try {
    const { genre } = req.params;
    const { page = 1, limit = 10 } = req.query;

    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const skip = (pageNum - 1) * limitNum;

    const [movies, totalCount] = await Promise.all([
      Movie.find({ genres: { $in: [genre] } })
        .sort({ averageRating: -1 })
        .skip(skip)
        .limit(limitNum)
        .lean(),
      Movie.countDocuments({ genres: { $in: [genre] } })
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

    paginationResponse(res, movies, pagination, `Movies in ${genre} genre retrieved successfully`);
  } catch (error) {
    console.error('Get movies by genre error:', error);
    errorResponse(res, 'Failed to retrieve movies by genre', 500);
  }
};

// Get featured movies
const getFeaturedMovies = async (req, res) => {
  try {
    const { limit = 10 } = req.query;
    
    // Get movies with highest average rating and recent releases
    const featuredMovies = await Movie.find({})
      .sort({ averageRating: -1, createdAt: -1 })
      .limit(parseInt(limit))
      .lean();

    successResponse(res, featuredMovies, 'Featured movies retrieved successfully');
  } catch (error) {
    console.error('Get featured movies error:', error);
    errorResponse(res, 'Failed to retrieve featured movies', 500);
  }
};

module.exports = {
  getAllMovies,
  getMovieById,
  createMovie,
  updateMovie,
  deleteMovie,
  getMoviesByGenre,
  getFeaturedMovies
};