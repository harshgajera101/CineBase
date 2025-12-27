import { useState, useEffect } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import {
  Container,
  Grid,
  Card,
  CardContent,
  CardMedia,
  CardActionArea,
  Typography,
  Box,
  Pagination,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  Rating,
  CircularProgress,
  Alert,
} from '@mui/material';
import { Star as StarIcon, AccessTime as TimeIcon } from '@mui/icons-material';
import API from '../utils/api';

const Home = () => {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [sortBy, setSortBy] = useState('rank');
  const [order, setOrder] = useState('asc');

  useEffect(() => {
    fetchMovies();
  }, [page, sortBy, order]);

  const fetchMovies = async () => {
    try {
      setLoading(true);
      const { data } = await API.get(
        `/movies?page=${page}&limit=20&sortBy=${sortBy}&order=${order}`
      );
      setMovies(data. data);
      setTotalPages(data.pages);
      setLoading(false);
    } catch (err) {
      setError('Failed to load movies');
      setLoading(false);
    }
  };

  const handlePageChange = (event, value) => {
    setPage(value);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
        <CircularProgress size={60} />
      </Box>
    );
  }

  if (error) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Alert severity="error">{error}</Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h3" fontWeight={700} gutterBottom>
          🎬 IMDb Top 250 Movies
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Discover the greatest movies of all time
        </Typography>
      </Box>

      {/* Sorting Controls */}
      <Box sx={{ mb: 4, display: 'flex', gap:  2, flexWrap: 'wrap' }}>
        <FormControl sx={{ minWidth: 200 }}>
          <InputLabel>Sort By</InputLabel>
          <Select
            value={sortBy}
            label="Sort By"
            onChange={(e) => {
              setSortBy(e. target.value);
              setPage(1);
            }}
          >
            <MenuItem value="rank">Rank</MenuItem>
            <MenuItem value="name">Title</MenuItem>
            <MenuItem value="rating">Rating</MenuItem>
            <MenuItem value="year">Year</MenuItem>
          </Select>
        </FormControl>

        <FormControl sx={{ minWidth: 150 }}>
          <InputLabel>Order</InputLabel>
          <Select
            value={order}
            label="Order"
            onChange={(e) => {
              setOrder(e.target.value);
              setPage(1);
            }}
          >
            <MenuItem value="asc">Ascending</MenuItem>
            <MenuItem value="desc">Descending</MenuItem>
          </Select>
        </FormControl>
      </Box>

      {/* Movie Grid */}
      <Grid container spacing={3}>
        {movies.map((movie) => (
          <Grid item xs={12} sm={6} md={4} lg={3} key={movie._id}>
            <Card
              elevation={3}
              sx={{
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                transition: 'transform 0.2s, box-shadow 0.2s',
                '&:hover': {
                  transform: 'translateY(-8px)',
                  boxShadow: 6,
                },
              }}
            >
              <CardActionArea
                component={RouterLink}
                to={`/movie/${movie._id}`}
                sx={{ flexGrow: 1, display: 'flex', flexDirection:  'column', alignItems: 'stretch' }}
              >
                {/* Movie Poster Placeholder */}
                <Box
                  sx={{
                    height: 300,
                    background: `linear-gradient(135deg, #667eea 0%, #764ba2 100%)`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    position: 'relative',
                  }}
                >
                  <Typography
                    variant="h1"
                    sx={{
                      color: 'white',
                      opacity: 0.3,
                      fontWeight: 700,
                    }}
                  >
                    #{movie.rank}
                  </Typography>
                  <Chip
                    label={`#${movie.rank}`}
                    color="primary"
                    size="small"
                    sx={{
                      position: 'absolute',
                      top: 10,
                      left: 10,
                      fontWeight: 600,
                    }}
                  />
                </Box>

                <CardContent sx={{ flexGrow: 1 }}>
                  {/* Title */}
                  <Typography
                    variant="h6"
                    fontWeight={600}
                    gutterBottom
                    sx={{
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      display: '-webkit-box',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical',
                      minHeight: 64,
                    }}
                  >
                    {movie.name}
                  </Typography>

                  {/* Year & Runtime */}
                  <Box sx={{ display: 'flex', alignItems: 'center', gap:  1, mb: 1 }}>
                    <Typography variant="body2" color="text.secondary">
                      {movie.year}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      •
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap:  0.5 }}>
                      <TimeIcon fontSize="small" color="action" />
                      <Typography variant="body2" color="text.secondary">
                        {movie.run_time}
                      </Typography>
                    </Box>
                  </Box>

                  {/* Genre */}
                  <Typography
                    variant="caption"
                    color="text. secondary"
                    sx={{
                      display: 'block',
                      mb: 1.5,
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {movie.genre}
                  </Typography>

                  {/* Rating */}
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <StarIcon sx={{ color: '#f5c518', fontSize: 20 }} />
                    <Typography variant="h6" fontWeight={600}>
                      {movie.rating}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      / 10
                    </Typography>
                  </Box>
                </CardContent>
              </CardActionArea>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Pagination */}
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 6 }}>
        <Pagination
          count={totalPages}
          page={page}
          onChange={handlePageChange}
          color="primary"
          size="large"
          showFirstButton
          showLastButton
        />
      </Box>
    </Container>
  );
};

export default Home;