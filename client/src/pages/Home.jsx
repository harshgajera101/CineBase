import { Container, Typography, Box } from '@mui/material';

const Home = () => {
  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Box>
        <Typography variant="h3" gutterBottom>
          🎬 Welcome to CineBase
        </Typography>
        <Typography variant="h6" color="text.secondary">
          Home Page - Coming Soon
        </Typography>
      </Box>
    </Container>
  );
};

export default Home;