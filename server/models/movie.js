const mongoose = require('mongoose');

// Cast member schema (embedded in Movie)
const castMemberSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  profileUrl: {
    type: String,
    default:null
  }
}, { _id: false });

// Movie Schema
const movieSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  genres: [{
    type: String,
    required: true
  }],
  releaseYear: {
    type: String,
    required: true
  },
  director: {
    type: String,
    required: true,
    trim: true
  },
  cast: [castMemberSchema],
  posterUrl: {
    type: String,
    required: true
  },
  trailerUrl: {
    type: String,
    default:null
  },
  averageRating: {
    type: Number,
    default: 0,
    min: 0,
    max: 5
  },
  totalReviews: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

// Create indexes for better performance
movieSchema.index({ title: 'text', description: 'text' });
movieSchema.index({ genres: 1 });
movieSchema.index({ releaseYear: 1 });
movieSchema.index({ averageRating: -1 });

module.exports = mongoose.model('Movie', movieSchema);