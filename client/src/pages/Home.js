import React from 'react';
import ProductList from '../components/ProductList';
import axios from 'axios';
import { useQuery } from 'react-query';
import { Container } from '@mui/material';

const Home = () => {
  const { isLoading, isError, data, error } = useQuery('products', () =>
    axios('http://localhost:3001/api/products', {
      responseType: 'json',
    })
      .then((response) => response.data)
  );

  return (
    <Container>
      {isLoading && <div>Loading...</div>}
      {isError && <div>Error: {error?.message ?? 'Unknown error'}</div>}
      {data && <ProductList products={data} title="Original artwork for purchase" />}
    </Container>
  );
};

export default Home;