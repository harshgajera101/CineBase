import { useState, useEffect } from 'react';
import {
  Container,
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
  FormHelperText,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
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
    run_time: '',
    tagline: '',
    budget: '',
    box_office: '',
    casts: '',
    directors: '',
    writers: '',
  });
  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState({ type: '', text: '' });

  const currentYear = new Date().getFullYear();

  useEffect(() => {
    fetchMovies();
  }, []);

  const fetchMovies = async () => {
    try {
      const { data } = await API.get('/movies?limit=10');
      setMovies(data.data);
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
    setEditMode(false);
    setCurrentMovie(null);
    setErrors({});
  };

  const validateField = (name, value) => {
    let error = '';

    switch (name) {
      case 'rank':
        if (!value || value < 1) {
          error = 'Rank must be a positive number';
        } else if (!Number.isInteger(Number(value))) {
          error = 'Rank must be a whole number';
        }
        break;

      case 'name':
        if (!value || value.trim().length === 0) {
          error = 'Title is required';
        } else if (value.length > 200) {
          error = 'Title must be less than 200 characters';
        }
        break;

      case 'year':
        const yearNum = Number(value);
        if (!value) {
          error = 'Year is required';
        } else if (yearNum < 1800) {
          error = 'Year must be 1800 or later';
        } else if (yearNum > currentYear + 5) {
          error = `Year cannot be more than ${currentYear + 5}`;
        }
        break;

      case 'rating': 
        const ratingNum = Number(value);
        if (!value) {
          error = 'Rating is required';
        } else if (ratingNum < 0) {
          error = 'Rating cannot be negative';
        } else if (ratingNum > 10) {
          error = 'Rating cannot exceed 10';
        }
        break;

      case 'genre':
        if (!value || value.trim().length === 0) {
          error = 'Genre is required';
        }
        break;

      case 'run_time':
        const runtimePattern = /^\d+h\s?\d*m? $/;
        if (!value) {
          error = 'Runtime is required';
        } else if (!runtimePattern.test(value.trim())) {
          error = 'Invalid format. Use: 2h 22m or 1h 30m';
        }
        break;

      case 'budget':
      case 'box_office': 
        if (value && Number(value) < 0) {
          error = 'Must be a positive number';
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

    // Real-time validation
    const error = validateField(name, value);
    setErrors({ ...errors, [name]: error });
  };

  const validateForm = () => {
    const newErrors = {};
    Object.keys(formData).forEach((key) => {
      const error = validateField(key, formData[key]);
      if (error) {
        newErrors[key] = error;
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      setMessage({ type: 'error', text: 'Please fix all validation errors before submitting' });
      return;
    }

    try {
      const cleanedData = {
        ...formData,
        name: formData.name.trim(),
        genre: formData.genre.trim(),
        run_time: formData.run_time.trim(),
      };

      if (editMode) {
        await API.put(`/movies/${currentMovie._id}`, cleanedData);
        setMessage({ type: 'success', text: 'Movie updated successfully!' });
      } else {
        await API. post('/movies', cleanedData);
        setMessage({ type: 'success', text: 'Movie added successfully!' });
      }
      fetchMovies();
      handleCloseDialog();
    } catch (err) {
      setMessage({ type: 'error', text: err.response?.data?.message || 'Operation failed' });
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
    <Box sx={{ bgcolor: 'background.default', minHeight: '100vh', py: 4 }}>
      <Container maxWidth="xl">
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
          <Typography variant="h4" fontWeight={700}>
            ⚙️ Admin Dashboard
          </Typography>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => handleOpenDialog()}
            size="large"
          >
            Add Movie
          </Button>
        </Box>

        {message.text && (
          <Alert severity={message.type} onClose={() => setMessage({ type:  '', text: '' })} sx={{ mb: 3 }}>
            {message.text}
          </Alert>
        )}

        <TableContainer component={Paper} elevation={3}>
          <Table>
            <TableHead>
              <TableRow sx={{ bgcolor: 'action.hover' }}>
                <TableCell><strong>Rank</strong></TableCell>
                <TableCell><strong>Title</strong></TableCell>
                <TableCell><strong>Year</strong></TableCell>
                <TableCell><strong>Rating</strong></TableCell>
                <TableCell><strong>Genre</strong></TableCell>
                <TableCell align="right"><strong>Actions</strong></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {movies.map((movie, index) => (
                <TableRow key={movie._id} sx={{ '&:nth-of-type(odd)': { bgcolor: 'action.hover' } }}>
                  <TableCell>
                    <Chip label={`#${movie.rank}`} size="small" color="primary" />
                  </TableCell>
                  <TableCell sx={{ fontWeight: 500 }}>{movie.name}</TableCell>
                  <TableCell>{movie.year}</TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                      ⭐ <strong>{movie.rating}</strong>
                    </Box>
                  </TableCell>
                  <TableCell>{movie.genre}</TableCell>
                  <TableCell align="right">
                    <IconButton color="primary" onClick={() => handleOpenDialog(movie)} size="small">
                      <EditIcon />
                    </IconButton>
                    <IconButton color="error" onClick={() => handleDelete(movie._id)} size="small">
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        {/* Add/Edit Dialog with Validation */}
        <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="md" fullWidth>
          <form onSubmit={handleSubmit}>
            <DialogTitle sx={{ bgcolor: 'primary.main', color: 'white' }}>
              {editMode ? '✏️ Edit Movie' : '➕ Add New Movie'}
            </DialogTitle>
            <DialogContent sx={{ pt: 3 }}>
              <Box sx={{ display: 'grid', gap: 2.5 }}>
                <TextField
                  name="rank"
                  label="Rank *"
                  type="number"
                  value={formData. rank}
                  onChange={handleChange}
                  error={!! errors.rank}
                  helperText={errors.rank || 'Enter the movie rank (positive integer)'}
                  required
                  inputProps={{ min: 1, step: 1 }}
                />

                <TextField
                  name="name"
                  label="Title *"
                  value={formData.name}
                  onChange={handleChange}
                  error={!!errors.name}
                  helperText={errors.name || `${formData.name. length}/200 characters`}
                  required
                  inputProps={{ maxLength: 200 }}
                />

                <TextField
                  name="year"
                  label="Year *"
                  type="number"
                  value={formData.year}
                  onChange={handleChange}
                  error={!!errors.year}
                  helperText={errors. year || `Valid range: 1800 to ${currentYear + 5}`}
                  required
                  inputProps={{ min: 1800, max: currentYear + 5 }}
                />

                <TextField
                  name="rating"
                  label="Rating *"
                  type="number"
                  step="0.1"
                  value={formData.rating}
                  onChange={handleChange}
                  error={!!errors.rating}
                  helperText={errors.rating || 'Rating must be between 0 and 10'}
                  required
                  inputProps={{ min: 0, max: 10, step: 0.1 }}
                />

                <TextField
                  name="genre"
                  label="Genre *"
                  value={formData.genre}
                  onChange={handleChange}
                  error={!!errors. genre}
                  helperText={errors.genre || 'e.g., Action, Drama, Comedy'}
                  required
                />

                <TextField
                  name="run_time"
                  label="Runtime *"
                  value={formData.run_time}
                  onChange={handleChange}
                  error={!!errors. run_time}
                  helperText={errors.run_time || 'Format: 2h 22m or 1h 30m'}
                  required
                  placeholder="2h 22m"
                />

                <TextField
                  name="tagline"
                  label="Tagline"
                  value={formData. tagline}
                  onChange={handleChange}
                  multiline
                  rows={2}
                  helperText="Optional: Movie tagline or quote"
                />

                <TextField
                  name="budget"
                  label="Budget"
                  type="number"
                  value={formData.budget}
                  onChange={handleChange}
                  error={!!errors.budget}
                  helperText={errors.budget || 'Optional: Enter amount in USD'}
                  inputProps={{ min: 0 }}
                />

                <TextField
                  name="box_office"
                  label="Box Office"
                  type="number"
                  value={formData.box_office}
                  onChange={handleChange}
                  error={!!errors.box_office}
                  helperText={errors. box_office || 'Optional:  Enter amount in USD'}
                  inputProps={{ min: 0 }}
                />

                <TextField
                  name="casts"
                  label="Cast"
                  value={formData.casts}
                  onChange={handleChange}
                  multiline
                  rows={2}
                  helperText="Optional:  Comma-separated list of actors"
                />

                <TextField
                  name="directors"
                  label="Directors"
                  value={formData.directors}
                  onChange={handleChange}
                  helperText="Optional: Comma-separated if multiple"
                />

                <TextField
                  name="writers"
                  label="Writers"
                  value={formData.writers}
                  onChange={handleChange}
                  helperText="Optional:  Comma-separated if multiple"
                />
              </Box>
            </DialogContent>
            <DialogActions sx={{ p: 2.5, gap: 1 }}>
              <Button onClick={handleCloseDialog} variant="outlined" size="large">
                Cancel
              </Button>
              <Button type="submit" variant="contained" size="large">
                {editMode ? 'Update Movie' : 'Add Movie'}
              </Button>
            </DialogActions>
          </form>
        </Dialog>
      </Container>
    </Box>
  );
};

export default AdminDashboard;