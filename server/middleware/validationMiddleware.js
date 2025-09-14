const { errorResponse } = require('../utils/responseUtils');

// Validate email format
const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Validate URL format
const isValidUrl = (url) => {
  try {
    new URL(url);
    return true;
  } catch (error) {
    return false;
  }
};

// Validate registration data
const validateRegister = (req, res, next) => {
  const { username, email, password } = req.body;
  console.log(username , email , password)
  const errors = [];

  if (!username || username.trim().length < 3) {
    errors.push('Username must be at least 3 characters long');
  }

  if (!email || !isValidEmail(email)) {
    errors.push('Valid email is required');
  }

  if (!password || password.length < 6) {
    errors.push('Password must be at least 6 characters long');
  }

      console.log("validated")
  if (errors.length > 0) {
    return errorResponse(res, 'Validation failed', 400, errors);
  }

  next();
};

// Validate login data
const validateLogin = (req, res, next) => {
  const { email, password } = req.body;
  const errors = [];

  if (!email || !isValidEmail(email)) {
    errors.push('Valid email is required');
  }

  if (!password) {
    errors.push('Password is required');
  }

  if (errors.length > 0) {
    return errorResponse(res, 'Validation failed', 400, errors);
  }

  next();
};

// Validate movie data
const validateMovie = (req, res, next) => {
  const { title, description, genres, releaseYear, director, cast, posterUrl, trailerUrl } = req.body;
  const errors = [];

  if (!title || title.trim().length < 1) {
    errors.push('Movie title is required');
  }

  if (!description || description.trim().length < 10) {
    errors.push('Movie description must be at least 10 characters long');
  }

  if (!genres || !Array.isArray(genres) || genres.length === 0) {
    errors.push('At least one genre is required');
  }

  if (!releaseYear || isNaN(releaseYear)) {
    errors.push('Valid release year is required');
  }

  if (!director || director.trim().length < 1) {
    errors.push('Director name is required');
  }

  if (!cast || !Array.isArray(cast)) {
    errors.push('Cast must be an array');
  } else {
    cast.forEach((member, index) => {
      if (!member.name || !member.profileUrl) {
        errors.push(`Cast member ${index + 1} must have name and profileUrl`);
      }
      if (member.profileUrl && !isValidUrl(member.profileUrl)) {
        errors.push(`Cast member ${index + 1} profileUrl must be a valid URL`);
      }
    });
  }

  if (!posterUrl || !isValidUrl(posterUrl)) {
    errors.push('Valid poster URL is required');
  }

  if (!trailerUrl || !isValidUrl(trailerUrl)) {
    errors.push('Valid trailer URL is required');
  }

  if (errors.length > 0) {
    return errorResponse(res, 'Validation failed', 400, errors);
  }

  next();
};

// Validate review data
const validateReview = (req, res, next) => {
  const { rating, reviewText } = req.body;
  const errors = [];

  if (!rating || isNaN(rating) || rating < 1 || rating > 5) {
    errors.push('Rating must be between 1 and 5');
  }

  if (!reviewText || reviewText.trim().length < 10) {
    errors.push('Review text must be at least 10 characters long');
  }

  if (reviewText && reviewText.length > 1000) {
    errors.push('Review text cannot exceed 1000 characters');
  }

  if (errors.length > 0) {
    return errorResponse(res, 'Validation failed', 400, errors);
  }

  next();
};

// Validate user profile update
const validateUserUpdate = (req, res, next) => {
  const { username, email, profilePicture } = req.body;
  const errors = [];

  if (username && username.trim().length < 3) {
    errors.push('Username must be at least 3 characters long');
  }

  if (email && !isValidEmail(email)) {
    errors.push('Valid email is required');
  }

  if (profilePicture && !isValidUrl(profilePicture)) {
    errors.push('Profile picture must be a valid URL');
  }

  if (errors.length > 0) {
    return errorResponse(res, 'Validation failed', 400, errors);
  }

  next();
};

module.exports = {
  validateRegister,
  validateLogin,
  validateMovie,
  validateReview,
  validateUserUpdate
};