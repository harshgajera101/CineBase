import { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Button,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Alert,
  Chip,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Settings as SettingsIcon,
} from '@mui/icons-material';
import API from '../utils/api';

const AdminDashboard = () => {
  const [movies, setMovies] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [currentMovie, setCurrentMovie] = useState(null);
  const [formData, setFormData] = useState({
    rank: '',
    name: '',
    year: '',
    rating: '',
    genre: '',
    run_time:  '',
    tagline: '',
    budget: '',
    box_office: '',
    casts:  '',
    directors: '',
    writers: '',
  });
  const [message, setMessage] = useState({ type: '', text: '' });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    fetchMovies();
  }, []);

  const fetchMovies = async () => {
    try {
      const { data } = await API.get('/movies');
      setMovies(data. data);
    } catch (err) {
      setMessage({ type: 'error', text: 'Failed to load movies' });
    }
  };

  const handleOpenDialog = (movie = null) => {
    if (movie) {
      setEditMode(true);
      setCurrentMovie(movie);
      setFormData(movie);
    } else {
      setEditMode(false);
      setCurrentMovie(null);
      setFormData({
        rank:  '',
        name: '',
        year: '',
        rating: '',
        genre: '',
        run_time: '',
        tagline: '',
        budget: '',
        box_office: '',
        casts: '',
        directors:  '',
        writers: '',
      });
    }
    setErrors({});
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setErrors({});
  };

  const validateField = (name, value) => {
    let error = '';

    switch (name) {
      case 'rank':
        if (! value) {
          error = 'Rank is required';
        } else if (isNaN(value) || ! Number.isInteger(Number(value))) {
          error = 'Rank must be a whole number';
        } else if (Number(value) < 1 || Number(value) > 250) {
          error = 'Rank must be between 1 and 250';
        }
        break;

      case 'year':
        if (!value) {
          error = 'Year is required';
        } else if (isNaN(value) || !Number.isInteger(Number(value))) {
          error = 'Year must be a whole number';
        } else if (Number(value) < 1800 || Number(value) > new Date().getFullYear() + 5) {
          error = `Year must be between 1800 and ${new Date().getFullYear() + 5}`;
        }
        break;

      case 'rating':
        if (! value) {
          error = 'Rating is required';
        } else if (isNaN(value)) {
          error = 'Rating must be a number';
        } else if (Number(value) < 0 || Number(value) > 10) {
          error = 'Rating must be between 0 and 10';
        }
        break;

      case 'name':
        if (!value || value.trim() === '') {
          error = 'Title is required';
        } else if (value.trim().length < 1) {
          error = 'Title must be at least 1 character';
        } else if (value.length > 200) {
          error = 'Title must be less than 200 characters';
        }
        break;

      case 'genre':
        if (!value || value.trim() === '') {
          error = 'Genre is required';
        }
        break;

      case 'run_time':
        if (!value || value.trim() === '') {
          error = 'Runtime is required (e.g., 2h 22m)';
        }
        break;

      default:
        break;
    }

    return error;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    
    const error = validateField(name, value);
    setErrors({ ...errors, [name]: error });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const newErrors = {};
    ['rank', 'name', 'year', 'rating', 'genre', 'run_time'].forEach(field => {
      const error = validateField(field, formData[field]);
      if (error) newErrors[field] = error;
    });

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setMessage({ type: 'error', text: 'Please fix all validation errors before submitting' });
      return;
    }

    try {
      if (editMode) {
        await API.put(`/movies/${currentMovie._id}`, formData);
        setMessage({ type: 'success', text: 'Movie updated successfully!' });
      } else {
        await API. post('/movies', formData);
        setMessage({ type: 'success', text: 'Movie added successfully!' });
      }
      handleCloseDialog();
      fetchMovies();
    } catch (err) {
      setMessage({ type: 'error', text:  err.response?.data?.message || 'Failed to save movie' });
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this movie?')) return;
    try {
      await API.delete(`/movies/${id}`);
      setMessage({ type: 'success', text: 'Movie deleted successfully!' });
      fetchMovies();
    } catch (err) {
      setMessage({ type: 'error', text: 'Failed to delete movie' });
    }
  };

  return (
    <Box sx={{ bgcolor: 'background.default', minHeight: '100vh', py: 4, width: '100%' }}>
      <Box sx={{ px: { xs: 2, sm: 3, md: 4, lg: 6 }, width: '100%' }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <SettingsIcon sx={{ fontSize: 32 }} />
            <Typography variant="h4" fontWeight={700}>
              Admin Dashboard
            </Typography>
          </Box>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => handleOpenDialog()}
            sx={{ px: 3, py: 1.5 }}
          >
            Add Movie
          </Button>
        </Box>

        {message.text && (
          <Alert severity={message.type} onClose={() => setMessage({ type:  '', text: '' })} sx={{ mb: 3 }}>
            {message.text}
          </Alert>
        )}

        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          Showing {movies.length} of 250 movies
        </Typography>

        <TableContainer component={Paper} sx={{ borderRadius: 2 }}>
          <Table>
            <TableHead sx={{ bgcolor: 'action.hover' }}>
              <TableRow>
                <TableCell><strong>Rank</strong></TableCell>
                <TableCell><strong>Title</strong></TableCell>
                <TableCell><strong>Year</strong></TableCell>
                <TableCell><strong>Rating</strong></TableCell>
                <TableCell><strong>Genre</strong></TableCell>
                <TableCell align="right"><strong>Actions</strong></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {movies.map((movie) => (
                <TableRow key={movie._id} hover>
                  <TableCell>
                    <Chip label={`#${movie.rank}`} size="small" color="primary" />
                  </TableCell>
                  <TableCell>{movie.name}</TableCell>
                  <TableCell>{movie. year}</TableCell>
                  <TableCell>⭐ {movie.rating}</TableCell>
                  <TableCell>{movie.genre}</TableCell>
                  <TableCell align="right">
                    <IconButton color="primary" onClick={() => handleOpenDialog(movie)}>
                      <EditIcon />
                    </IconButton>
                    <IconButton color="error" onClick={() => handleDelete(movie._id)}>
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        {/* Add/Edit Dialog */}
        <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="md" fullWidth>
          <form onSubmit={handleSubmit}>
            <DialogTitle>{editMode ? 'Edit Movie' : 'Add New Movie'}</DialogTitle>
            <DialogContent>
              <Box sx={{ display: 'grid', gap: 2, pt: 2 }}>
                {/* ✅ Rank - with validation */}
                <TextField
                  name="rank"
                  label="Rank"
                  type="number"
                  value={formData.rank}
                  onChange={handleChange}
                  required
                  error={!!errors.rank}
                  helperText={errors.rank || 'Must be a number between 1 and 250'}
                />

                {/* ✅ Title - with validation */}
                <TextField
                  name="name"
                  label="Title"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  error={!!errors.name}
                  helperText={errors.name || 'Movie title (required)'}
                />

                {/* ✅ Year - with validation */}
                <TextField
                  name="year"
                  label="Year"
                  type="number"
                  value={formData.year}
                  onChange={handleChange}
                  required
                  error={!! errors.year}
                  helperText={errors.year || `Release year (e.g., ${new Date().getFullYear()})`}
                />

                {/* ✅ Rating - with validation */}
                <TextField
                  name="rating"
                  label="Rating"
                  type="number"
                  step="0.1"
                  value={formData.rating}
                  onChange={handleChange}
                  required
                  error={!!errors.rating}
                  helperText={errors.rating || 'Rating from 0 to 10 (e.g., 9.3)'}
                />

                {/* ✅ Genre - with validation */}
                <TextField
                  name="genre"
                  label="Genre"
                  value={formData.genre}
                  onChange={handleChange}
                  required
                  error={!!errors.genre}
                  helperText={errors.genre || 'Genre (e.g., Drama, Action)'}
                />

                {/* ✅ Runtime - with validation */}
                <TextField
                  name="run_time"
                  label="Runtime"
                  value={formData.run_time}
                  onChange={handleChange}
                  required
                  error={!!errors.run_time}
                  helperText={errors.run_time || 'Format: 2h 22m or 142 min'}
                />

                {/* Optional fields */}
                <TextField
                  name="tagline"
                  label="Tagline"
                  value={formData.tagline}
                  onChange={handleChange}
                  multiline
                  rows={2}
                  helperText="Movie tagline (optional)"
                />

                <TextField
                  name="budget"
                  label="Budget"
                  value={formData.budget}
                  onChange={handleChange}
                  helperText="Production budget (optional, e.g., $25 million)"
                />

                <TextField
                  name="box_office"
                  label="Box Office"
                  value={formData.box_office}
                  onChange={handleChange}
                  helperText="Box office earnings (optional, e.g., $286.8 million)"
                />

                <TextField
                  name="casts"
                  label="Cast"
                  value={formData. casts}
                  onChange={handleChange}
                  multiline
                  rows={2}
                  helperText="Comma-separated actor names (optional)"
                />

                <TextField
                  name="directors"
                  label="Directors"
                  value={formData.directors}
                  onChange={handleChange}
                  helperText="Director name(s) (optional)"
                />

                <TextField
                  name="writers"
                  label="Writers"
                  value={formData.writers}
                  onChange={handleChange}
                  helperText="Writer name(s) (optional)"
                />
              </Box>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleCloseDialog}>Cancel</Button>
              <Button 
                type="submit" 
                variant="contained"
                disabled={Object.keys(errors).some(key => errors[key])}
              >
                {editMode ? 'Update' : 'Add'}
              </Button>
            </DialogActions>
          </form>
        </Dialog>
      </Box>
    </Box>
  );
};

export default AdminDashboard;