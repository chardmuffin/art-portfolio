import React from 'react';
import {
  Box,
  useMediaQuery,
  ImageList,
  ImageListItem,
  Typography
} from '@mui/material';
import { Link } from 'react-router-dom';

const ProductList = ({ products, title }) => {

  const smallScreen = useMediaQuery('(max-width: 600px)');
  const mediumScreen = useMediaQuery('(max-width: 960px)');
  const cols = smallScreen ? 1 : (mediumScreen ? 2 : 3);
  const width = 300;
  const height = 350;

  return (
    <Box sx={{ mx: 'auto', my: 2 }}>
      <Typography variant='h6' sx={{ my: 2 }}>
        {title}
      </Typography>
        <ImageList variant="masonry" cols={cols} gap={30}>
          {products &&
            products.map((product) => (
              
              <ImageListItem key={product.id} sx={{ maxWidth: width, maxHeight: height, mx: 'auto', textAlign: 'center' }}>
                <Link to={`/products/${product.id}`}>
                  <Box component={'img'}
                    src={`http://localhost:3001/api/products/images/${product.image.id}?width=${width}&height=${height}`}
                    alt={product.name}
                    loading="lazy"
                    sx={{ boxShadow: 3 }}
                  />
                </Link>
              </ImageListItem>
            )
          )}
        </ImageList>
    </Box>
  );
};

export default ProductList;