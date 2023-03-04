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
  const width = smallScreen ? 300 : (mediumScreen ? 370 : 325);

  return (
    <Box sx={{ mx: 'auto', my: 2 }}>
      <Typography variant='h6'>{title}</Typography>
        <ImageList variant="masonry" cols={cols} gap={30}>
          {products &&
            products.map((product) => (
              
              <ImageListItem key={product.id} sx={{ maxWidth: width, mx: 'auto' }}>
                <Link to={`/products/${product.id}`}>
                  <img
                    src={`http://localhost:3001/api/products/images/${product.image.id}?width=${width}`}
                    alt={product.name}
                    loading="lazy"
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