import React from 'react';
import { Container, Grid, Typography } from '@mui/material';

const AdminDashboard = () => {
  return (
    <Container component={'main'}>
      <Grid container justifyContent="center">
        <Grid item xs={12} sx={{ textAlign: 'center' }}>
          <Typography variant="h5">Admin Dashboard</Typography>
        </Grid>
      </Grid>
    </Container>
  );
};

export default AdminDashboard;