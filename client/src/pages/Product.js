import React from 'react';
import { Box, Container, Typography, useMediaQuery } from '@mui/material';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { useQuery } from 'react-query';
import { toMoneyFormat } from '../utils/helpers';

const Product = () => {
  const { id } = useParams();
  const { isLoading, isError, data: product, error } = useQuery('product', () =>
    axios(`http://localhost:3001/api/products/${id}`, {
      responseType: 'json',
    }).then((response) => response.data)
  );

  const smallScreen = useMediaQuery('(max-width: 600px)');
  //const mediumScreen = useMediaQuery('(max-width: 960px)');
  const width = smallScreen ? 300 : 800;
  const height = smallScreen ? 400 : 700;
  
  return (
    <Container component={'main'}>
      {isLoading && <div>Loading...</div>}
      {isError && <div>Error: {error?.message ?? 'Unknown error'}</div>}
      {product &&
      
        <Box sx={{ mx: 'auto', my: 2, textAlign: 'center' }}>
          <Typography variant='h6'>{product.name}</Typography>
          <img
            src={`http://localhost:3001/api/products/images/${product.image.id}?width=${width}&height=${height}`}
            alt={product.name}
            loading="lazy"
          />
          <Typography>{product.description}</Typography>
          <Typography>{toMoneyFormat(product.price)}</Typography>
          <Typography>{product.stock} in stock</Typography>
        </Box>
      }
    </Container>
  );
};

export default Product;