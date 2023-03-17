import React from 'react';
import ProductList from '../components/ProductList';
import axios from 'axios';
import { useQuery } from 'react-query';
import { Container, CircularProgress } from '@mui/material';

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
      {data && <ProductList products={data} title="Artwork for purchase" />}
    </Container>
  );
};

export default Home;