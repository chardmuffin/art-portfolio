import React from 'react';
import axios from 'axios';
import { useQuery } from 'react-query';
import { Container } from '@mui/material';

const Profile = (userId) => {

  const { isLoading, isError, data, error } = useQuery('user', () =>
    axios(`http://localhost:3001/api/users/${userId}`, {
      responseType: 'json',
    })
      .then((response) => response.data)
  );

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (isError) {
    return <div>Error: { error?.message ?? 'Unknown error' }</div>;
  }

  return (
    <Container component={'main'}>
      Profile
    </Container>
  );
};

export default Profile;
