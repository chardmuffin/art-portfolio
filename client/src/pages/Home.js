import React from 'react';
import ProductList from '../components/ProductList';
import axios from 'axios';
import { useQuery } from 'react-query';
import { Container, CircularProgress, Grid } from '@mui/material';

const Home = () => {
  const { isLoading, isError, data, error } = useQuery('products', () =>
    axios('http://localhost:3001/api/products', {
      responseType: 'json',
    })
      .then((response) => response.data)
  );

  if (isLoading) {
    return <Container component={'main'}><CircularProgress /></Container>;
  }

  if (isError) {
    return <Container component={'main'}>Error: {error?.message ?? 'Unknown error'}</Container>;
  }

  return (
    <Container component={'main'}>
      <Grid container spacing={2} justifyContent="center" sx={{ my: 4 }}>
        <Grid item xs={11} md={10}>
          {data && <ProductList products={data} title="Artwork for purchase" titleVariant='h4' />}
        </Grid>
      </Grid>
      
    </Container>
  );
};

export default Home;