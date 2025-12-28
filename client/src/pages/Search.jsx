import { useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import {
  Box,
  TextField,
  Button,
  Typography,
  Card,
  CardContent,
  CardActionArea,
  Chip,
  Alert,
  CircularProgress,
  InputAdornment,
} from '@mui/material';
import {
  Search as SearchIcon,
  Star as StarIcon,
  AccessTime as TimeIcon,
} from '@mui/icons-material';
import API from '../utils/api';

const Search = () => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [searched, setSearched] = useState(false);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!query.trim()) return;

    try {
      setLoading(true);
      setError('');
      const { data } = await API.get(`/movies/search?q=${query}`);
      setResults(data. data);
      setSearched(true);
      setLoading(false);
    } catch (err) {
      setError('Search failed. Please try again.');
      setLoading(false);
    }
  };

  return (
    <Box sx={{ bgcolor: 'background.default', minHeight: '100vh', width: '100%', py: 4 }}>
      {/* ✅ FIXED:  Changed from Container to Box with full width padding */}
      <Box sx={{ px: { xs: 2, sm: 3, md: 4, lg: 6 }, width: '100%' }}>
        {/* Search Header */}
        <Box sx={{ textAlign: 'center', mb: 6 }}>
          <Typography variant="h3" fontWeight={700} gutterBottom>
            🔍 Search Movies
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Search for movies by title, genre, or tagline
          </Typography>
        </Box>

        {/* Search Form */}
        <Box component="form" onSubmit={handleSearch} sx={{ mb: 4, maxWidth: 800, mx: 'auto' }}>
          <Box sx={{ display: 'flex', gap: 2 }}>
            <TextField
              fullWidth
              placeholder="Search for movies...  (e.g., Godfather, Drama, Hope)"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
              }}
              sx={{
                bgcolor: 'background.paper',
                borderRadius: 1,
              }}
            />
            <Button
              type="submit"
              variant="contained"
              size="large"
              disabled={loading}
              sx={{ px: 4, whiteSpace: 'nowrap' }}
            >
              Search
            </Button>
          </Box>
        </Box>

        {/* Loading */}
        {loading && (
          <Box display="flex" justifyContent="center" py={8}>
            <CircularProgress size={60} />
          </Box>
        )}

        {/* Error */}
        {error && (
          <Alert severity="error" sx={{ mb: 4, maxWidth: 800, mx: 'auto' }}>
            {error}
          </Alert>
        )}

        {/* Results */}
        {searched && ! loading && (
          <>
            <Typography variant="h6" gutterBottom sx={{ mb: 3 }}>
              {results.length > 0
                ? `Found ${results.length} result${results.length !== 1 ? 's' :  ''}`
                : 'No movies found'}
            </Typography>

            {/* ✅ FIXED: Using same grid layout as Home page with fixed card sizes */}
            <Box
              sx={{
                display: 'grid',
                gap: 3,
                width: '100%',
                
                // Mobile:  1 card, full width
                gridTemplateColumns: '1fr',
                justifyContent: 'center',
                
                // Tablet: 2 cards
                '@media (min-width: 600px)': {
                  gridTemplateColumns: 'repeat(2, 240px)',
                },
                
                // Small desktop: 3 cards
                '@media (min-width: 900px)': {
                  gridTemplateColumns: 'repeat(3, 240px)',
                },
                
                // Medium desktop: 4 cards
                '@media (min-width: 1200px)': {
                  gridTemplateColumns: 'repeat(4, 240px)',
                },
                
                // Large desktop: 5 cards
                '@media (min-width: 1400px)': {
                  gridTemplateColumns: 'repeat(5, 240px)',
                  justifyContent: 'flex-start',
                },
              }}
            >
              {results.map((movie) => (
                <Card
                  key={movie._id}
                  elevation={3}
                  sx={{
                    width: '240px',
                    display: 'flex',
                    flexDirection: 'column',
                    borderRadius: 2,
                    bgcolor: 'background.paper',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      transform: 'translateY(-8px)',
                      boxShadow: 6,
                    },
                  }}
                >
                  <CardActionArea
                    component={RouterLink}
                    to={`/movie/${movie._id}`}
                    sx={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'stretch',
                      height: '100%',
                    }}
                  >
                    {/* Poster - Fixed Height */}
                    <Box
                      sx={{
                        height: 220,
                        width: '100%',
                        background: `linear-gradient(135deg, #667eea 0%, #764ba2 100%)`,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        position: 'relative',
                        flexShrink: 0,
                      }}
                    >
                      <Typography
                        variant="h1"
                        sx={{
                          color: 'white',
                          opacity: 0.2,
                          fontWeight: 700,
                          fontSize: '4rem',
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
                      {/* Title - Fixed Height */}
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
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                        <Typography variant="caption" color="text.secondary" fontWeight={600}>
                          {movie.year}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          •
                        </Typography>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                          <TimeIcon sx={{ fontSize: 14 }} color="action" />
                          <Typography variant="caption" color="text.secondary">
                            {movie.run_time}
                          </Typography>
                        </Box>
                      </Box>

                      {/* Genre */}
                      <Typography
                        variant="caption"
                        color="text.secondary"
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
          </>
        )}
      </Box>
    </Box>
  );
};

export default Search;