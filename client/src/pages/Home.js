import React from 'react';
import ProductList from '../components/ProductList';
import axios from 'axios';
import { useQuery } from 'react-query';

const Home = () => {
  const { isLoading, isError, data, error } = useQuery('products', () =>
    axios('http://localhost:3001/api/products', {
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
    <main>
      <ProductList
        products={data}
        title="Original artwork for purchase"
      />
    </main>
  );
};

export default Home;