import React, { useState } from 'react';
import axios from '../utils/axiosConfig';
import { useMutation } from 'react-query';
import { Container, TextField, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const Signup = () => {
  const navigate = useNavigate();
  const [formState, setFormState] = useState({
    email: '',
    password: '',
  });

  const { mutate, isLoading, isError, data, error } = useMutation(
    (formData) => axios.post('/api/users/', formData),
    {
      onSuccess: (data) => {
        console.log(data);
        // Redirect to homepage
        navigate('/');
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

  return (
    <Container component={'main'}>
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
          Sign Up
        </Button>
      </form>
    </Container>
  );
};

export default Signup;
