import React from 'react';
import {
  Box,
  useMediaQuery,
  ImageList,
  ImageListItem,
  Typography
} from '@mui/material';
import { Link } from 'react-router-dom';

const ProductList = ({ products, title, titleVariant, titleAlign }) => {

  const smallScreen = useMediaQuery('(max-width: 600px)');
  const mediumScreen = useMediaQuery('(max-width: 900px)');
  const cols = smallScreen ? 1 : (mediumScreen ? 2 : 3);
  const width = 300;
  const height = 350;
  const urlRoot = process.env.NODE_ENV === 'production' ? process.env.REACT_APP_API_BASE_URL : 'http://localhost:3001'

  return (
    <Box sx={{ mx: 'auto', my: 2 }}>
      <Typography variant={titleVariant ? titleVariant : 'h6'} textAlign={titleAlign && titleAlign} sx={{ m: 2 }}>
        {title}
      </Typography>
      {products.length >= 1
      ? <ImageList variant="masonry" cols={cols} gap={12} >
          {products.map((product) => (
            <ImageListItem key={product.id} sx={{ textAlign: 'center', p: 2 }}>
              <Link to={`/products/${product.id}`}>
                <Box component={'img'}
                  src={`${urlRoot}/api/products/images/${product.image.id}?width=${width}&height=${height}`}
                  alt={product.name}
                  loading="lazy"
                  sx={{ maxWidth: '100%', maxHeight: '100%', borderRadius: '2px', boxShadow: 8 }}
                />
              </Link>
            </ImageListItem>
          ))}
        </ImageList>
      :
      <Typography sx={{ textAlign: 'center', my: 4 }} >No items found!</Typography>
      }
    </Box>
  );
};

export default ProductList;