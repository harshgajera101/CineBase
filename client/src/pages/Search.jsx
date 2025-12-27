import { Container, Typography, Box } from '@mui/material';

const Search = () => {
  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Box>
        <Typography variant="h4" gutterBottom>
          🔍 Search Movies
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Search Page - Coming Soon
        </Typography>
      </Box>
    </Container>
  );
};

export default Search;