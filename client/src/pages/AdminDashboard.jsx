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
  const [message, setMessage] = useState({ type: '', text: '' });

  useEffect(() => {
    fetchMovies();
  }, []);

  const fetchMovies = async () => {
    try {
      const { data } = await API.get('/movies? limit=10');
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
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditMode(false);
    setCurrentMovie(null);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editMode) {
        await API.put(`/movies/${currentMovie._id}`, formData);
        setMessage({ type: 'success', text: 'Movie updated successfully!' });
      } else {
        await API. post('/movies', formData);
        setMessage({ type: 'success', text: 'Movie added successfully!' });
      }
      fetchMovies();
      handleCloseDialog();
    } catch (err) {
      setMessage({ type: 'error', text: err.response?.data?.message || 'Operation failed' });
    }
  };

  const handleDelete = async (id) => {
    if (! window.confirm('Are you sure you want to delete this movie?')) return;

    try {
      await API.delete(`/movies/${id}`);
      setMessage({ type: 'success', text: 'Movie deleted successfully!' });
      fetchMovies();
    } catch (err) {
      setMessage({ type: 'error', text: 'Failed to delete movie' });
    }
  };

  return (
    <Box sx={{ bgcolor: 'background.default', minHeight: '100vh', py:  4 }}>
      <Container maxWidth="xl">
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
          <Typography variant="h4" fontWeight={700}>
            ⚙️ Admin Dashboard
          </Typography>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => handleOpenDialog()}
          >
            Add Movie
          </Button>
        </Box>

        {message.text && (
          <Alert severity={message.type} onClose={() => setMessage({ type:  '', text: '' })} sx={{ mb: 3 }}>
            {message.text}
          </Alert>
        )}

        <TableContainer component={Paper}>
          <Table>
            <TableHead>
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
                <TableRow key={movie._id}>
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
                <TextField name="rank" label="Rank" type="number" value={formData.rank} onChange={handleChange} required />
                <TextField name="name" label="Title" value={formData.name} onChange={handleChange} required />
                <TextField name="year" label="Year" type="number" value={formData. year} onChange={handleChange} required />
                <TextField name="rating" label="Rating" type="number" step="0.1" value={formData.rating} onChange={handleChange} required />
                <TextField name="genre" label="Genre" value={formData.genre} onChange={handleChange} required />
                <TextField name="run_time" label="Runtime (e.g., 2h 22m)" value={formData.run_time} onChange={handleChange} required />
                <TextField name="tagline" label="Tagline" value={formData.tagline} onChange={handleChange} multiline rows={2} />
                <TextField name="budget" label="Budget" value={formData.budget} onChange={handleChange} />
                <TextField name="box_office" label="Box Office" value={formData.box_office} onChange={handleChange} />
                <TextField name="casts" label="Cast (comma-separated)" value={formData.casts} onChange={handleChange} multiline rows={2} />
                <TextField name="directors" label="Directors" value={formData.directors} onChange={handleChange} />
                <TextField name="writers" label="Writers" value={formData.writers} onChange={handleChange} />
              </Box>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleCloseDialog}>Cancel</Button>
              <Button type="submit" variant="contained">
                {editMode ? 'Update' : 'Add'}
              </Button>
            </DialogActions>
          </form>
        </Dialog>
      </Container>
    </Box>
  );
};

export default AdminDashboard;