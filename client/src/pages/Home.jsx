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
  Container,
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
      <Container maxWidth="xl" sx={{ py: 4 }}>
        <Alert severity="error">{error}</Alert>
      </Container>
    );
  }

  return (
    <Box sx={{ bgcolor: 'background.default', minHeight: '100vh' }}>
      {/* Hero Banner */}
      <Box
        sx={{
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white',
          py: { xs: 6, md: 8 },
          mb: 4,
        }}
      >
        <Container maxWidth="xl">
          <Box sx={{ textAlign: 'center' }}>
            <MovieIcon sx={{ fontSize: { xs: 60, md: 80 }, mb: 2, opacity: 0.9 }} />
            <Typography variant="h2" fontWeight={700} gutterBottom sx={{ fontSize: { xs: '2rem', md: '3rem' } }}>
              CineBase - IMDb Top 250 Movies
            </Typography>
            <Typography variant="h6" sx={{ opacity: 0.95, maxWidth: 800, mx: 'auto', mt: 2, fontSize: { xs: '1rem', md: '1.25rem' } }}>
              Explore the greatest movies of all time.  Search, filter, and discover
              cinematic masterpieces from every era and genre.
            </Typography>
            <Box sx={{ mt: 4, display: 'flex', justifyContent: 'center', gap: 2, flexWrap: 'wrap' }}>
              <Chip label="250 Movies" sx={{ bgcolor: 'rgba(255,255,255,0.2)', color: 'white', fontWeight: 600 }} />
              <Chip label="Multiple Genres" sx={{ bgcolor: 'rgba(255,255,255,0.2)', color: 'white', fontWeight: 600 }} />
              <Chip label="Sortable & Searchable" sx={{ bgcolor: 'rgba(255,255,255,0.2)', color: 'white', fontWeight: 600 }} />
            </Box>
          </Box>
        </Container>
      </Box>

      <Container maxWidth="xl" sx={{ pb: 6 }}>
        {/* Filter Section */}
        <Paper elevation={3} sx={{ p: 3, mb: 4, borderRadius: 2, bgcolor: 'background.paper' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb:  3 }}>
            <FilterIcon sx={{ mr: 1, color: 'primary.main' }} />
            <Typography variant="h6" fontWeight={600}>
              Filter & Sort Movies
            </Typography>
          </Box>
          
          <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', alignItems: 'flex-end' }}>
            <FormControl sx={{ minWidth: 200, flex: { xs: '1 1 100%', sm: '1 1 auto' } }}>
              <InputLabel>Sort By</InputLabel>
              <Select value={tempSortBy} label="Sort By" onChange={(e) => setTempSortBy(e. target.value)}>
                <MenuItem value="rank">Rank</MenuItem>
                <MenuItem value="name">Title (A-Z)</MenuItem>
                <MenuItem value="rating">Rating</MenuItem>
                <MenuItem value="year">Year</MenuItem>
              </Select>
            </FormControl>

            <FormControl sx={{ minWidth: 150, flex: { xs: '1 1 100%', sm:  '1 1 auto' } }}>
              <InputLabel>Order</InputLabel>
              <Select value={tempOrder} label="Order" onChange={(e) => setTempOrder(e.target. value)}>
                <MenuItem value="asc">{tempSortBy === 'name' ? 'A → Z' : 'Low → High'}</MenuItem>
                <MenuItem value="desc">{tempSortBy === 'name' ? 'Z → A' : 'High → Low'}</MenuItem>
              </Select>
            </FormControl>

            <Button
              variant="contained"
              size="large"
              onClick={applyFilters}
              startIcon={<FilterIcon />}
              sx={{ px: 4, flex: { xs: '1 1 100%', sm: '0 0 auto' } }}
            >
              APPLY FILTERS
            </Button>

            <Box sx={{ flex: '1 1 auto', textAlign: { xs: 'center', md:  'right' } }}>
              <Typography variant="body2" color="text.secondary">
                Showing {movies.length} of 250 movies
              </Typography>
            </Box>
          </Box>
        </Paper>

        {/* Movie Grid - FIXED 5 PER ROW */}
        <Box 
          sx={{ 
            display: 'flex',
            flexWrap: 'wrap',
            gap: 3,
            justifyContent: { xs: 'center', lg: 'flex-start' },
          }}
        >
          {movies.map((movie) => (
            <Card
              key={movie._id}
              elevation={4}
              sx={{
                width: { xs: '100%', sm: 'calc(50% - 12px)', md: 'calc(33.333% - 16px)', lg: 'calc(20% - 19.2px)' },
                maxWidth: 280,
                display: 'flex',
                flexDirection: 'column',
                borderRadius: 2,
                bgcolor: 'background.paper',
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                '&:hover': {
                  transform: 'translateY(-12px) scale(1.02)',
                  boxShadow: 12,
                },
              }}
            >
              <CardActionArea
                component={RouterLink}
                to={`/movie/${movie._id}`}
                sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', alignItems: 'stretch' }}
              >
                {/* Movie Poster */}
                <Box
                  sx={{
                    height: 320,
                    background: `linear-gradient(135deg, #667eea 0%, #764ba2 100%)`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    position: 'relative',
                    overflow: 'hidden',
                  }}
                >
                  <Typography variant="h1" sx={{ color: 'white', opacity: 0.15, fontWeight: 700, fontSize: '8rem' }}>
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
                      bgcolor: 'rgba(0,0,0,0.8)',
                      color: 'white',
                      fontSize: '0.875rem',
                    }}
                  />
                </Box>

                <CardContent sx={{ flexGrow: 1, p: 2.5 }}>
                  <Typography
                    variant="h6"
                    fontWeight={700}
                    gutterBottom
                    sx={{
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      display: '-webkit-box',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical',
                      minHeight: 56,
                      lineHeight: 1.4,
                      color: 'text.primary',
                      fontSize: '1.1rem',
                    }}
                  >
                    {movie. name}
                  </Typography>

                  <Box sx={{ display:  'flex', alignItems: 'center', gap:  1, mb: 1.5 }}>
                    <Typography variant="body2" color="text.secondary" fontWeight={600}>
                      {movie.year}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">•</Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                      <TimeIcon sx={{ fontSize: 16 }} color="action" />
                      <Typography variant="body2" color="text.secondary">
                        {movie.run_time}
                      </Typography>
                    </Box>
                  </Box>

                  <Typography
                    variant="caption"
                    color="text. secondary"
                    sx={{
                      display: 'block',
                      mb: 2,
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {movie.genre}
                  </Typography>

                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 0.5,
                      bgcolor: 'rgba(102, 126, 234, 0.15)',
                      p: 1,
                      borderRadius: 1.5,
                      justifyContent: 'center',
                    }}
                  >
                    <StarIcon sx={{ color: '#f5c518', fontSize: 22 }} />
                    <Typography variant="h6" fontWeight={700} color="text. primary">
                      {movie. rating}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      / 10
                    </Typography>
                  </Box>
                </CardContent>
              </CardActionArea>
            </Card>
          ))}
        </Box>

        {/* Pagination */}
        <Box sx={{ display: 'flex', justifyContent: 'center', mt:  6 }}>
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
                fontSize: '1rem',
              },
            }}
          />
        </Box>
      </Container>
    </Box>
  );
};

export default Home;