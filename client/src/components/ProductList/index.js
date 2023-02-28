import React from 'react';
import {
  ImageList,
  ImageListItem
} from '@mui/material';

const ProductList = ({ products, title }) => {
  if (!products.length) {
    return <h3>No Products Found</h3>;
  }

  return (
    <>
      <h3>{title}</h3>
      <ImageList variant="masonry" cols={3} gap={8}>
        {products &&
          products.map((product) => {
            return (
              <ImageListItem key={product.id}>
                <img
                  src={`${product.img}?w=248&fit=crop&auto=format`}
                  srcSet={`${product.img}?w=248&fit=crop&auto=format&dpr=2 2x`}
                  alt={product.name}
                  loading="lazy"
                />
              </ImageListItem>
            )
          }
        )}
      </ImageList>
    </>
  );
};

export default ProductList;