import React, { useEffect, useState } from 'react';
import { Container, Grid, Typography, Stepper, Step, StepLabel, Box, Button } from '@mui/material';
import { isLoggedIn } from '../utils/helpers';
import { useNavigate } from 'react-router-dom';
import NewCategoryForm from '../components/NewCategoryForm';
import NewOptionsForm from '../components/NewOptionsForm';
import NewProductForm from '../components/NewProductForm';

const AdminDashboard = () => {
  const [activeStep, setActiveStep] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoggedIn()) navigate('/login');
  }, [navigate])

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  return (
    <Container component={'main'}>
      <Grid container justifyContent="center">
        <Grid item xs={12} sx={{ textAlign: 'center', my: 2 }}>
          <Typography variant="h5">Admin Dashboard</Typography>
          <Typography variant="subtitle1">Create</Typography>
        </Grid>
      </Grid>

      <Grid container justifyContent="center">
        <Grid item xs={12} md={8}>
          <Box sx={{ my: 2 }}>
            <Stepper activeStep={activeStep}>
              <Step>
                <StepLabel>Category</StepLabel>
              </Step>
              <Step>
                <StepLabel>Option Group</StepLabel>
              </Step>
              <Step>
                <StepLabel>Product</StepLabel>
              </Step>
            </Stepper>

            {activeStep === 0 && <NewCategoryForm />}
            {activeStep === 1 && <NewOptionsForm />}
            {activeStep === 2 && <NewProductForm />}

            <Box sx={{ mt: 2, display: 'flex', justifyContent: 'space-between' }}>
              <Button onClick={handleBack} disabled={activeStep === 0}>
                Back
              </Button>
              <Button variant="contained" onClick={handleNext} disabled={activeStep === 3}>
                Next
              </Button>
            </Box>
          </Box>
        </Grid>
      </Grid>
    </Container>
  );
};

export default AdminDashboard;