import React from 'react';
import { Container, Grid, Card, CardHeader, Divider, CardContent, Typography } from '@mui/material';

const About = () => {
  return (
    <Container component={'main'}>
      <Grid container justifyContent="center">
        <Grid item xs={12} md={8}>
          <Card sx={{ my: 2, boxShadow: 8, borderRadius: '2px' }}>
            <CardHeader title="About" sx={{ textAlign: 'center' }} />
            <Divider />
            <CardContent>
              <Typography variant="body1" sx={{ textAlign: 'center' }}>
                Richard's studio is located in Durham, North Carolina.
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

    </Container>
  );
};

export default About;