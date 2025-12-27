import { Container, Typography, Box } from '@mui/material';

const MovieDetail = () => {
  return (
    <Container maxWidth="lg" sx={{ py:  4 }}>
      <Box>
        <Typography variant="h4" gutterBottom>
          🎥 Movie Details
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Movie Detail Page - Coming Soon
        </Typography>
      </Box>
    </Container>
  );
};

export default MovieDetail;