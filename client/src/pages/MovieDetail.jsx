import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Container,
  Box,
  Typography,
  Chip,
  Button,
  Paper,
  Grid,
  CircularProgress,
  Alert,
  Divider,
} from '@mui/material';
import {
  ArrowBack as BackIcon,
  Star as StarIcon,
  CalendarToday as CalendarIcon,
  AccessTime as TimeIcon,
  AttachMoney as MoneyIcon,
  Category as GenreIcon,
  Person as PersonIcon,
} from '@mui/icons-material';
import API from '../utils/api';

const MovieDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchMovie();
  }, [id]);

  const fetchMovie = async () => {
    try {
      setLoading(true);
      const { data } = await API.get(`/movies/${id}`);
      setMovie(data.data);
      setLoading(false);
    } catch (err) {
      setError('Failed to load movie details');
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
        <CircularProgress size={60} />
      </Box>
    );
  }

  if (error || !movie) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Alert severity="error">{error || 'Movie not found'}</Alert>
        <Button startIcon={<BackIcon />} onClick={() => navigate('/')} sx={{ mt: 2 }}>
          Back to Home
        </Button>
      </Container>
    );
  }

  return (
    <Box sx={{ bgcolor: 'background. default', minHeight: '100vh', py: 4 }}>
      <Container maxWidth="lg">
        {/* Back Button */}
        <Button
          startIcon={<BackIcon />}
          onClick={() => navigate(-1)}
          sx={{ mb: 3 }}
        >
          Back
        </Button>

        <Grid container spacing={4}>
          {/* Poster */}
          <Grid item xs={12} md={4}>
            <Paper
              elevation={4}
              sx={{
                height: 500,
                background: `linear-gradient(135deg, #667eea 0%, #764ba2 100%)`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: 2,
                position: 'relative',
              }}
            >
              <Typography
                variant="h1"
                sx={{
                  color: 'white',
                  opacity: 0.2,
                  fontWeight: 700,
                  fontSize: '10rem',
                }}
              >
                {movie. rank}
              </Typography>
              <Chip
                label={`#${movie.rank}`}
                color="primary"
                sx={{
                  position: 'absolute',
                  top: 20,
                  left: 20,
                  fontWeight: 700,
                  fontSize: '1rem',
                }}
              />
            </Paper>
          </Grid>

          {/* Details */}
          <Grid item xs={12} md={8}>
            <Paper elevation={2} sx={{ p: 4, borderRadius: 2 }}>
              {/* Title */}
              <Typography variant="h3" fontWeight={700} gutterBottom>
                {movie. name}
              </Typography>

              {/* Rating */}
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
                <StarIcon sx={{ color: '#f5c518', fontSize: 32 }} />
                <Typography variant="h4" fontWeight={700}>
                  {movie.rating}
                </Typography>
                <Typography variant="h6" color="text.secondary">
                  / 10
                </Typography>
              </Box>

              {/* Tagline */}
              {movie.tagline && (
                <Typography
                  variant="h6"
                  color="text. secondary"
                  fontStyle="italic"
                  sx={{ mb: 3 }}
                >
                  "{movie.tagline}"
                </Typography>
              )}

              <Divider sx={{ my: 3 }} />

              {/* Info Grid */}
              <Grid container spacing={3}>
                <Grid item xs={12} sm={6}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                    <CalendarIcon color="action" />
                    <Typography variant="body1">
                      <strong>Year:</strong> {movie.year}
                    </Typography>
                  </Box>
                </Grid>

                <Grid item xs={12} sm={6}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                    <TimeIcon color="action" />
                    <Typography variant="body1">
                      <strong>Runtime:</strong> {movie.run_time}
                    </Typography>
                  </Box>
                </Grid>

                <Grid item xs={12}>
                  <Box sx={{ display: 'flex', alignItems:  'center', gap: 1, mb: 2 }}>
                    <GenreIcon color="action" />
                    <Typography variant="body1">
                      <strong>Genre:</strong> {movie.genre}
                    </Typography>
                  </Box>
                </Grid>

                {movie.budget && movie.budget !== 'Not Available' && (
                  <Grid item xs={12} sm={6}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                      <MoneyIcon color="action" />
                      <Typography variant="body1">
                        <strong>Budget:</strong> ${parseInt(movie.budget).toLocaleString()}
                      </Typography>
                    </Box>
                  </Grid>
                )}

                {movie.box_office && movie.box_office !== 'Not Available' && (
                  <Grid item xs={12} sm={6}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap:  1, mb: 2 }}>
                      <MoneyIcon color="action" />
                      <Typography variant="body1">
                        <strong>Box Office:</strong> ${parseInt(movie.box_office).toLocaleString()}
                      </Typography>
                    </Box>
                  </Grid>
                )}
              </Grid>

              <Divider sx={{ my: 3 }} />

              {/* Cast */}
              {movie.casts && (
                <Box sx={{ mb: 3 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap:  1, mb: 1 }}>
                    <PersonIcon color="action" />
                    <Typography variant="h6" fontWeight={600}>
                      Cast
                    </Typography>
                  </Box>
                  <Typography variant="body1" color="text.secondary">
                    {movie.casts}
                  </Typography>
                </Box>
              )}

              {/* Directors */}
              {movie.directors && (
                <Box sx={{ mb: 3 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap:  1, mb: 1 }}>
                    <PersonIcon color="action" />
                    <Typography variant="h6" fontWeight={600}>
                      Director{movie.directors.includes(',') ? 's' : ''}
                    </Typography>
                  </Box>
                  <Typography variant="body1" color="text.secondary">
                    {movie.directors}
                  </Typography>
                </Box>
              )}

              {/* Writers */}
              {movie.writers && (
                <Box>
                  <Box sx={{ display: 'flex', alignItems:  'center', gap: 1, mb: 1 }}>
                    <PersonIcon color="action" />
                    <Typography variant="h6" fontWeight={600}>
                      Writer{movie.writers.includes(',') ? 's' : ''}
                    </Typography>
                  </Box>
                  <Typography variant="body1" color="text.secondary">
                    {movie.writers}
                  </Typography>
                </Box>
              )}
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default MovieDetail;