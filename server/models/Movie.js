const mongoose = require('mongoose');

const movieSchema = new mongoose.Schema(
  {
    rank: {
      type: Number,
      required: true,
    },
    name: {
      type: String,
      required:  true,
      trim: true,
    },
    year: {
      type: Number,
      required: true,
    },
    rating: {
      type: Number,
      required: true,
      min: 0,
      max: 10,
    },
    genre:  {
      type: String,
      required: true,
    },
    run_time: {
      type: String,
      required: true,
    },
    tagline: {
      type: String,
      default: '',
    },
    budget: {
      type: String,
      default: 'Not Available',
    },
    box_office: {
      type:  String,
      default: 'Not Available',
    },
    casts: {
      type: String,
      default: '',
    },
    directors: {
      type: String,
      default: '',
    },
    writers: {
      type: String,
      default:  '',
    },
  },
  { timestamps: true }
);

// Text index for search functionality
movieSchema.index({ name: 'text', tagline: 'text', genre: 'text' });

module.exports = mongoose.model('Movie', movieSchema);