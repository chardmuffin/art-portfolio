import { useState } from 'react';
import { Box, Container, Typography, useMediaQuery, FormControl, InputLabel, MenuItem, Select } from '@mui/material';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { useQuery } from 'react-query';
import { toMoneyFormat } from '../utils/helpers';

const Product = () => {
  const { id } = useParams();
  const { isLoading, isError, data: product, error } = useQuery('productOptions', () =>
    axios(`http://localhost:3001/api/products/${id}/options`, {
      responseType: 'json',
    }).then((response) => response.data)
  );
  const [form, setForm] = useState({
    option: '',
    productOption: ''
  });

  const handleFormChange = (name, value) => {
    setForm((prevFilters) => ({
      ...prevFilters,
      [name]: value,
      productOption: product.product_options.find(
        (productOption) => productOption.option.name === value
      ),
    }));
  };

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
          <Typography variant='h6' gutterBottom>{product.name}</Typography>
          <img
            src={`http://localhost:3001/api/products/images/${product.image.id}?width=${width}&height=${height}`}
            alt={product.name}
            loading="lazy"
          />
          
          {product.product_options.length > 0 ? (
            <>
              <Typography gutterBottom>
                {toMoneyFormat(
                  parseFloat(product.price) +
                  parseFloat((form.productOption ? form.productOption.price_difference : 0))
                )}
              </Typography>
              {((form.productOption.stock <= 3) && <Typography>Only {form.productOption.stock} left in stock!</Typography>)}
              <FormControl fullWidth>
                <InputLabel id="options-label">
                  {product.product_options[0].option.option_group.name}
                </InputLabel>
                <Select
                  label="Options"
                  autoWidth
                  value={form.option}
                  onChange={(e) => handleFormChange('option', e.target.value)}
                >
                  {product.product_options.map((productOption, index) => (
                    <MenuItem
                      key={index}
                      value={productOption.option.name}
                      disabled={productOption.stock === 0}
                    >
                      {productOption.option.name}
                      {productOption.stock === 0 && ' (out of stock)'}
                    </MenuItem>
                  ))}
                </Select>

                {form.productOption && ((form.productOption.stock <= 3) && <Typography>Only {form.productOption.stock} left in stock!</Typography>)}
              </FormControl>
            </>
          ) : (
            <>
              <Typography>{toMoneyFormat(parseFloat(product.price))}</Typography>
              {(product.stock <= 3) && <Typography>Only {product.stock} left in stock!</Typography>}
            </>
          )}
   
          <Typography gutterBottom>{product.description}</Typography>

        </Box>
      }
    </Container>
  );
};

export default Product;