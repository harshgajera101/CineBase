const Movie = require('../models/Movie');

// @desc    Get all movies with pagination & sorting
// @route   GET /api/movies
// @access  Public
const getMovies = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const sortBy = req.query.sortBy || 'rank'; // rank, name, rating, year
    const order = req.query.order === 'desc' ? -1 : 1;

    const skip = (page - 1) * limit;

    // Build sort object
    const sortObj = {};
    sortObj[sortBy] = order;

    const movies = await Movie.find()
      .sort(sortObj)
      .limit(limit)
      .skip(skip);

    const total = await Movie.countDocuments();

    res.json({
      success: true,
      count: movies.length,
      total,
      page,
      pages: Math.ceil(total / limit),
      data: movies,
    });
  } catch (error) {
    console.error('❌ Get Movies Error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error' 
    });
  }
};

// @desc    Search movies by name, tagline, or genre
// @route   GET /api/movies/search
// @access  Public
const searchMovies = async (req, res) => {
  try {
    const { q } = req.query;

    if (!q) {
      return res.status(400).json({ 
        success: false, 
        message: 'Please provide search query' 
      });
    }

    const movies = await Movie.find({
      $or: [
        { name: { $regex: q, $options: 'i' } },
        { tagline: { $regex: q, $options: 'i' } },
        { genre: { $regex: q, $options: 'i' } },
      ],
    }).limit(50);

    res.json({
      success: true,
      count: movies.length,
      data: movies,
    });
  } catch (error) {
    console.error('❌ Search Movies Error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error' 
    });
  }
};

// @desc    Get single movie by ID
// @route   GET /api/movies/:id
// @access  Public
const getMovieById = async (req, res) => {
  try {
    const movie = await Movie.findById(req.params.id);

    if (!movie) {
      return res.status(404).json({ 
        success: false, 
        message: 'Movie not found' 
      });
    }

    res.json({
      success: true,
      data: movie,
    });
  } catch (error) {
    console.error('❌ Get Movie Error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error' 
    });
  }
};

// @desc    Create new movie
// @route   POST /api/movies
// @access  Private/Admin
const createMovie = async (req, res) => {
  try {
    const movie = await Movie.create(req.body);

    res.status(201).json({
      success: true,
      data: movie,
    });
  } catch (error) {
    console.error('❌ Create Movie Error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error',
      error: error.message 
    });
  }
};

// @desc    Update movie
// @route   PUT /api/movies/:id
// @access  Private/Admin
const updateMovie = async (req, res) => {
  try {
    const movie = await Movie.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators:  true }
    );

    if (!movie) {
      return res.status(404).json({ 
        success: false, 
        message: 'Movie not found' 
      });
    }

    res.json({
      success: true,
      data:  movie,
    });
  } catch (error) {
    console.error('❌ Update Movie Error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error' 
    });
  }
};

// @desc    Delete movie
// @route   DELETE /api/movies/:id
// @access  Private/Admin
const deleteMovie = async (req, res) => {
  try {
    const movie = await Movie.findByIdAndDelete(req.params.id);

    if (!movie) {
      return res.status(404).json({ 
        success: false, 
        message: 'Movie not found' 
      });
    }

    res.json({
      success: true,
      message: 'Movie deleted successfully',
    });
  } catch (error) {
    console.error('❌ Delete Movie Error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error' 
    });
  }
};

module.exports = {
  getMovies,
  searchMovies,
  getMovieById,
  createMovie,
  updateMovie,
  deleteMovie,
};