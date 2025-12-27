import { useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import {
  Container,
  Box,
  TextField,
  Button,
  Typography,
  Card,
  CardContent,
  CardActionArea,
  Grid,
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
    <Box sx={{ bgcolor: 'background.default', minHeight: '100vh', py: 4 }}>
      <Container maxWidth="lg">
        {/* Search Header */}
        <Box sx={{ textAlign: 'center', mb:  6 }}>
          <Typography variant="h3" fontWeight={700} gutterBottom>
            🔍 Search Movies
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Search for movies by title, genre, or tagline
          </Typography>
        </Box>

        {/* Search Form */}
        <Box component="form" onSubmit={handleSearch} sx={{ mb: 4 }}>
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
              sx={{ px: 4 }}
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
          <Alert severity="error" sx={{ mb: 4 }}>
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

            <Grid container spacing={3}>
              {results.map((movie) => (
                <Grid item xs={12} sm={6} md={4} key={movie._id}>
                  <Card
                    elevation={3}
                    sx={{
                      height: '100%',
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
                      sx={{ height: '100%' }}
                    >
                      {/* Poster */}
                      <Box
                        sx={{
                          height: 220,
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

                      <CardContent>
                        <Typography variant="h6" fontWeight={700} gutterBottom>
                          {movie.name}
                        </Typography>

                        <Box sx={{ display: 'flex', alignItems: 'center', gap:  1, mb: 1 }}>
                          <Typography variant="caption" color="text.secondary">
                            {movie.year}
                          </Typography>
                          <Typography variant="caption">•</Typography>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap:  0.5 }}>
                            <TimeIcon sx={{ fontSize: 14 }} />
                            <Typography variant="caption" color="text.secondary">
                              {movie.run_time}
                            </Typography>
                          </Box>
                        </Box>

                        <Typography
                          variant="caption"
                          color="text. secondary"
                          sx={{ display: 'block', mb: 1.5 }}
                        >
                          {movie.genre}
                        </Typography>

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
                          <StarIcon sx={{ color: '#f5c518', fontSize: 18 }} />
                          <Typography variant="h6" fontWeight={700}>
                            {movie. rating}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            / 10
                          </Typography>
                        </Box>
                      </CardContent>
                    </CardActionArea>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </>
        )}
      </Container>
    </Box>
  );
};

export default Search;