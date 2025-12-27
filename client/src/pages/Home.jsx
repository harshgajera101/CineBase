import { useState, useEffect } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import {
  Card,
  CardContent,
  CardActionArea,
  Typography,
  Box,
  Pagination,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  CircularProgress,
  Alert,
  Button,
  Paper,
  Grid,
} from '@mui/material';
import {
  Star as StarIcon,
  AccessTime as TimeIcon,
  FilterList as FilterIcon,
  Movie as MovieIcon,
} from '@mui/icons-material';
import API from '../utils/api';

const Home = () => {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  
  // Filter states
  const [sortBy, setSortBy] = useState('rank');
  const [order, setOrder] = useState('asc');
  const [tempSortBy, setTempSortBy] = useState('rank');
  const [tempOrder, setTempOrder] = useState('asc');

  useEffect(() => {
    fetchMovies();
  }, [page, sortBy, order]);

  const fetchMovies = async () => {
    try {
      setLoading(true);
      const { data } = await API.get(
        `/movies?page=${page}&limit=20&sortBy=${sortBy}&order=${order}`
      );
      setMovies(data.data);
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

  const applyFilters = () => {
    setSortBy(tempSortBy);
    setOrder(tempOrder);
    setPage(1);
  };

  if (loading && movies.length === 0) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
        <CircularProgress size={60} />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ py: 4, px: { xs: 2, sm: 3, md: 4 } }}>
        <Alert severity="error">{error}</Alert>
      </Box>
    );
  }

  return (
    <Box sx={{ bgcolor: 'background.default', minHeight: '100vh' }}>
      {/* Hero Banner */}
      <Box
        sx={{
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white',
          py: 8,
          mb: 4,
        }}
      >
        <Box sx={{ maxWidth: '1400px', mx: 'auto', px: { xs: 2, sm: 3, md: 4 } }}>
          <Box sx={{ textAlign: 'center' }}>
            <MovieIcon sx={{ fontSize: 80, mb: 2, opacity: 0.9 }} />
            <Typography variant="h2" fontWeight={700} gutterBottom>
              CineBase - IMDb Top 250 Movies
            </Typography>
            <Typography variant="h5" sx={{ opacity: 0.95, maxWidth: 800, mx: 'auto', mt: 2 }}>
              Explore the greatest movies of all time.  Search, filter, and discover
              cinematic masterpieces from every era and genre.
            </Typography>
            <Box sx={{ mt: 4, display: 'flex', justifyContent: 'center', gap: 2, flexWrap: 'wrap' }}>
              <Chip
                label="250 Movies"
                sx={{ bgcolor: 'rgba(255,255,255,0.2)', color: 'white', fontWeight: 600 }}
              />
              <Chip
                label="Multiple Genres"
                sx={{ bgcolor: 'rgba(255,255,255,0.2)', color: 'white', fontWeight:  600 }}
              />
              <Chip
                label="Sortable & Searchable"
                sx={{ bgcolor:  'rgba(255,255,255,0.2)', color: 'white', fontWeight: 600 }}
              />
            </Box>
          </Box>
        </Box>
      </Box>

      {/* Main Content */}
      <Box sx={{ maxWidth: '1400px', mx: 'auto', pb: 6, px: { xs: 2, sm: 3, md: 4 } }}>
        {/* Filter Section */}
        <Paper elevation={2} sx={{ p: 3, mb: 4, borderRadius: 2, bgcolor: 'background.paper' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <FilterIcon sx={{ mr: 1 }} />
            <Typography variant="h6" fontWeight={600}>
              Filter & Sort Movies
            </Typography>
          </Box>
          
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} sm={6} md={3}>
              <FormControl fullWidth>
                <InputLabel>Sort By</InputLabel>
                <Select
                  value={tempSortBy}
                  label="Sort By"
                  onChange={(e) => setTempSortBy(e.target.value)}
                >
                  <MenuItem value="rank">Rank</MenuItem>
                  <MenuItem value="name">Title (A-Z)</MenuItem>
                  <MenuItem value="rating">Rating</MenuItem>
                  <MenuItem value="year">Year</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} sm={6} md={3}>
              <FormControl fullWidth>
                <InputLabel>Order</InputLabel>
                <Select
                  value={tempOrder}
                  label="Order"
                  onChange={(e) => setTempOrder(e.target.value)}
                >
                  <MenuItem value="asc">
                    {tempSortBy === 'name' ? 'A → Z' : 'Low → High'}
                  </MenuItem>
                  <MenuItem value="desc">
                    {tempSortBy === 'name' ?  'Z → A' : 'High → Low'}
                  </MenuItem>
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} md={3}>
              <Button
                fullWidth
                variant="contained"
                size="large"
                onClick={applyFilters}
                startIcon={<FilterIcon />}
                sx={{ py: 1.8 }}
              >
                APPLY FILTERS
              </Button>
            </Grid>

            <Grid item xs={12} md={3}>
              <Typography variant="body2" color="text.secondary" align="center">
                Showing {movies.length} of 250 movies
              </Typography>
            </Grid>
          </Grid>
        </Paper>

        {/* Movie Grid - Fixed Size Cards, 5 per row */}
        <Box 
          sx={{ 
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 240px))',
            gap: 3,
            justifyContent: 'center',
            width: '100%',
            
            // Responsive:  adjust card size for different screens
            '@media (max-width: 600px)': {
              gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            },
            '@media (min-width: 601px) and (max-width: 900px)': {
              gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 240px))',
            },
            '@media (min-width: 901px)': {
              gridTemplateColumns:  'repeat(5, 240px)',
              justifyContent: 'flex-start',
            },
          }}
        >
          {movies.map((movie) => (
            <Card
              key={movie._id}
              elevation={3}
              sx={{
                width: '240px', // Fixed width
                display: 'flex',
                flexDirection: 'column',
                borderRadius: 2,
                bgcolor: 'background.paper',
                transition: 'all 0.3s ease',
                '&:hover': {
                  transform: 'translateY(-12px)',
                  boxShadow: 8,
                },
              }}
            >
              <CardActionArea
                component={RouterLink}
                to={`/movie/${movie._id}`}
                sx={{
                  flexGrow: 1,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'stretch',
                }}
              >
                {/* Movie Poster */}
                <Box
                  sx={{
                    height: 280,
                    background: `linear-gradient(135deg, #667eea 0%, #764ba2 100%)`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    position: 'relative',
                    overflow: 'hidden',
                  }}
                >
                  <Typography
                    variant="h1"
                    sx={{
                      color: 'white',
                      opacity: 0.2,
                      fontWeight: 700,
                      fontSize: '6rem',
                    }}
                  >
                    {movie.rank}
                  </Typography>
                  <Chip
                    label={`#${movie.rank}`}
                    size="small"
                    sx={{
                      position: 'absolute',
                      top: 12,
                      left: 12,
                      fontWeight: 700,
                      bgcolor: 'rgba(0,0,0,0.7)',
                      color: 'white',
                    }}
                  />
                </Box>

                <CardContent sx={{ flexGrow: 1, p: 2 }}>
                  {/* Title */}
                  <Typography
                    variant="subtitle1"
                    fontWeight={700}
                    gutterBottom
                    sx={{
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      display: '-webkit-box',
                      WebkitLineClamp:  2,
                      WebkitBoxOrient: 'vertical',
                      minHeight: 48,
                      lineHeight: 1.3,
                      color: 'text.primary',
                    }}
                  >
                    {movie.name}
                  </Typography>

                  {/* Year & Runtime */}
                  <Box sx={{ display: 'flex', alignItems: 'center', gap:  1, mb: 1 }}>
                    <Typography variant="caption" color="text.secondary" fontWeight={600}>
                      {movie.year}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      •
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap:  0.5 }}>
                      <TimeIcon sx={{ fontSize: 14 }} color="action" />
                      <Typography variant="caption" color="text.secondary">
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
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 0.5,
                      bgcolor: 'rgba(102, 126, 234, 0.1)',
                      p: 0.8,
                      borderRadius: 1,
                    }}
                  >
                    <StarIcon sx={{ color: '#f5c518', fontSize: 20 }} />
                    <Typography variant="h6" fontWeight={700} color="text.primary">
                      {movie.rating}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      / 10
                    </Typography>
                  </Box>
                </CardContent>
              </CardActionArea>
            </Card>
          ))}
        </Box>

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
            sx={{
              '& .MuiPaginationItem-root': {
                fontWeight: 600,
                color: 'text.primary',
              },
            }}
          />
        </Box>
      </Box>
    </Box>
  );
};

export default Home;