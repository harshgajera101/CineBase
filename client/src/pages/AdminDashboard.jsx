import { Container, Typography, Box } from '@mui/material';

const AdminDashboard = () => {
  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Box>
        <Typography variant="h4" gutterBottom>
          ⚙️ Admin Dashboard
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Admin Dashboard - Coming Soon
        </Typography>
      </Box>
    </Container>
  );
};

export default AdminDashboard;