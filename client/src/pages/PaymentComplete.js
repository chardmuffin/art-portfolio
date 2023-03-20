import { useEffect } from 'react';
import { Container, Grid, Typography, List, ListItem, ListItemText } from '@mui/material';

const PaymentComplete = ({ order, setCart }) => {

  useEffect(() => {
    setCart(Array(0));
  }, [setCart])

  return (
    <Container component={'main'}>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Typography variant='h4' component="h2" sx={{ my: 4, textAlign: 'center' }}>
            Thank you!
          </Typography>
        </Grid>

        <Grid item xs={12} md={6}>
          <Typography variant='h6' component="h3" sx={{ mb: 2 }}>Order Summary:</Typography>
          <List>
            {order.purchasedItems.map((item, index) => (
              <ListItem key={index}>
                <ListItemText primary={`${item.name} (${item.quantity})`} secondary={`Price: $${item.price}`} />
              </ListItem>
            ))}
          </List>
        </Grid>

        <Grid item xs={12} md={6}>
          <Typography variant='h6' component="h3" sx={{ mb: 2 }}>Ship to:</Typography>
          <Typography>Name: {order.shippingInfo.name}</Typography>
          <Typography>Address: {order.shippingInfo.addressLine1}</Typography>
          {order.shippingInfo.addressLine2 && <Typography>         {order.shippingInfo.addressLine2}</Typography>}
          <Typography>City: {order.shippingInfo.city}</Typography>
          <Typography>State: {order.shippingInfo.state}</Typography>
          <Typography>ZIP Code: {order.shippingInfo.zip}</Typography>
        </Grid>
      </Grid>
    </Container>
  );
};

export default PaymentComplete;