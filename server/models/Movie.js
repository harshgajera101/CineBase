const mongoose = require('mongoose');

const movieSchema = new mongoose.Schema(
  {
    rank: {
      type: Number,
      required: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    year: {
      type:  Number,
      required: true,
    },
    rating: {
      type: Number,
      required: true,
      min:  0,
      max: 10,
    },
    genre: {
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
    casts: {
      type: String,
      default: '',
    },
    directors: {
      type: String,
      default:  '',
    },
  },
  { timestamps: true }
);

// Index for search optimization
movieSchema.index({ name: 'text', tagline: 'text' });

module.exports = mongoose.model('Movie', movieSchema);