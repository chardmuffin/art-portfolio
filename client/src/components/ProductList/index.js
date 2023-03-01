import React from 'react';
import {
  Box,
  useMediaQuery,
  ImageList,
  ImageListItem
} from '@mui/material';

const ProductList = ({ products, title }) => {

  const smallScreen = useMediaQuery('(max-width: 960px)');
  const cols = smallScreen ? 1 : 2;
  const width = smallScreen ? 300 : 500;

  return (
    <Box sx={{ width: '90%', mx: 'auto' }}>
      <h3>{title}</h3>
        <ImageList variant="masonry" cols={cols} gap={30}>
          {products &&
            products.map((product) => (
              <ImageListItem key={product.id} sx={{ maxWidth: width, mx: 'auto' }}>
                <img
                  src={`http://localhost:3001/api/products/images/${product.image.id}?width=${width}`}
                  alt={product.name}
                  loading="lazy"
                />
              </ImageListItem>
            )
          )}
        </ImageList>
    </Box>
  );
};

export default ProductList;