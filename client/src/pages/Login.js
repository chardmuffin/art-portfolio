import React, { useState } from 'react';
import axios from 'axios';
import { useMutation } from 'react-query';
import { Container, TextField, Button, Grid, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { isLoggedIn } from '../utils/helpers';

const Login = () => {
  const navigate = useNavigate();
  const [formState, setFormState] = useState({
    email: '',
    password: '',
  });

  const { mutate, isLoading, isError, data, error } = useMutation(
    (formData) => axios.post(`/api/users/login`, formData),
    {
      onSuccess: (data) => {
        console.log(data.data.user);
        sessionStorage.setItem('loggedIn', true);
        sessionStorage.setItem('user_id', data.data.user.id);
        navigate('/admin-dashboard');
      },
    }
  );

  // update state based on form input changes
  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormState({
      ...formState,
      [name]: value,
    });
  };

  // submit form
  const handleFormSubmit = async (event) => {
    event.preventDefault();

    try {
      await mutate(formState);
    } catch (error) {
      console.log(error);
    }
  };

  if (isLoading) {
    return <Container component={'main'}>Loading...</Container>;
  }

  if (isError) {
    return <Container component={'main'}>Error: {error?.message ?? 'Unknown error'}</Container>;
  }

  // Redirect to admin dashboard if user is already logged in
  if (isLoggedIn()) {
    navigate('/admin-dashboard');
  }

  return (
    <Container component={'main'}>
      <Grid container sx={{ textAlign: 'center', justifyContent: 'center', my: 4 }}>
        <Grid item xs={12} sm={8} md={6}>
          <Typography variant='h5' >
            Admin Login
          </Typography>
          <form onSubmit={handleFormSubmit}>
            <TextField
              id="email"
              label="Email"
              variant="outlined"
              name="email"
              type="email"
              value={formState.email}
              onChange={handleChange}
              margin="normal"
              required
              fullWidth
            />
            <TextField
              id="password"
              label="Password"
              variant="outlined"
              name="password"
              type="password"
              value={formState.password}
              onChange={handleChange}
              margin="normal"
              required
              fullWidth
            />
            <Button variant="contained" color="primary" type="submit">
              Login
            </Button>
          </form>
        </Grid>
      </Grid>
      
    </Container>
  );
};

export default Login;