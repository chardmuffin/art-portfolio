import React from 'react';
import { Container, Typography, Box } from '@mui/material';
import { toMoneyFormat } from '../utils/helpers';

const Checkout = ({ cart }) => {
  return (
    <Container component={'main'}>
      <Typography variant='h3' component="h2" textAlign={'center'}>Checkout Page</Typography>
      {cart.map((item, index) => {
        return (
          <Box key={index} sx={{ mx: 'auto', my: 2, textAlign: 'left', display: 'flex', width: '100%', boxShadow: 15, borderRadius: '2px' }}>
            <Box component={'img'}
              src={`http://localhost:3001/api/products/images/${item.image.id}?width=100&height=150`}
              alt={item.name}
              loading="lazy"
              sx={{
                m: 2,
                boxShadow: 15,
                borderRadius: '2px',
              }}
            />
            <Box sx={{ p: 1, my: 2, width: 1, fontStyle: 'italic', textAlign: 'left', letterSpacing: 2  }}>
              <Typography variant='h5' component="h3" >{item.name}</Typography>
              {item.product_option?.option_1 &&
                <Typography variant='subtitle2'>
                  {item.product_option.option_1.option_group.name}: {item.product_option.option_1.name}
                </Typography>
              }
              {item.product_option?.option_2 &&
                <Typography variant='subtitle2'>
                  {item.product_option.option_2.option_group.name}: {item.product_option.option_2.name}
                </Typography>
              }
              {item.product_option?.option_3 &&
                <Typography variant='subtitle2'>
                  {item.product_option.option_3.option_group.name}: {item.product_option.option_3.name}
                </Typography>
              }
              <Typography variant='subtitle2'>Quantity: 1</Typography>
              <Typography variant='subtitle2'>
                Price: {toMoneyFormat(item.product_option?.price_difference ?
                  parseFloat(item.product_option.price_difference) + parseFloat(item.price)
                  : item.price)}
              </Typography>
            </Box>
          </Box>
        )
      })}
    </Container>
  );
};

export default Checkout;