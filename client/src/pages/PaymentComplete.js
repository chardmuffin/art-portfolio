import { useState, useEffect, useCallback } from 'react';
import { Container, TextField, Button, Box, Grid, Snackbar, Typography, List, ListItem, ListItemText, CardHeader, CardContent, Card, Divider, Slide } from '@mui/material';
import MuiAlert from '@mui/material/Alert';
import emailjs from 'emailjs-com';
import { formatDate } from '../utils/helpers';

const serviceID = process.env.REACT_APP_EMAILJS_SERVICE_ID;
const templateID = process.env.REACT_APP_EMAILJS_TEMPLATE_ID;
const userID = process.env.REACT_APP_EMAILJS_USER_ID;

const PaymentComplete = ({ order, setCart }) => {

  const [userEmail, setUserEmail] = useState('');
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarType, setSnackbarType] = useState('success');

  const stringifyOrder = useCallback(() => {
    const itemStr = order.purchasedItems
      .map((item, index) => {
        const options = [];
        if (item.product_option) {
          if (item.product_option.option_1) {
            options.push(`\t${item.product_option.option_1.option_group.name}: ${item.product_option.option_1.name}`);
          }
          if (item.product_option.option_2) {
            options.push(`\t${item.product_option.option_2.option_group.name}: ${item.product_option.option_2.name}`);
          }
          if (item.product_option.option_3) {
            options.push(`\t${item.product_option.option_3.option_group.name}: ${item.product_option.option_3.name}`);
          }
        }
  
        const optionsStr = options.length ? '\n' + options.join('\n') : '';
  
        return `- ${item.name} (${item.quantity})${optionsStr}`;
      })
      .join('\n');
  
  return (
`${order.shippingInfo.name} purchased the following items on ${formatDate(order.orderDate)}:
${itemStr}

Order Total: ${order.total}

Ship to:
${order.shippingInfo.name}
${order.shippingInfo.addressLine1}
${order.shippingInfo.addressLine2}
${order.shippingInfo.city}, ${order.shippingInfo.state}, ${order.shippingInfo.zip}`
  
  )}, [order]);

  const sendEmailToSeller = useCallback(() => {
    emailjs
      .send(
        serviceID,
        templateID,
        {
          name: order.shippingInfo.name,
          subject: "NEW ORDER",
          message: stringifyOrder(),
          email: "richardhuffman96+artsales@gmail.com"
        },
        userID
      )
      .then(
        (response) => {
          console.log('Order sent successfully to seller', response);
        },
        (error) => {
          console.error('Order failed to send to seller', error);
        }
      );
  }, [order, stringifyOrder]);
  
  const sendEmailToUser = () => {
    emailjs
      .send(
        serviceID,
        templateID,
        {
          name: order.shippingInfo.name,
          subject: "NEW ORDER WITH CONTACT",
          message: stringifyOrder(),
          email: userEmail
        },
        userID
      )
      .then(
        (response) => {
          console.log('Order sent successfully to seller', response);
          setSnackbarType('success');
        },
        (error) => {
          console.error('Order failed to send to seller', error);
          setSnackbarType('error');
        }
      )
      .finally(() => {
        setSnackbarOpen(true);
      });
  };

  useEffect(() => {
    setCart(Array(0));
    sendEmailToSeller();
  }, [setCart, sendEmailToSeller])

  return (
    <Container component={'main'}>
      <Grid container spacing={2} justifyContent="center">
        <Grid item xs={12} md={8}>
          <Card sx={{ my: 8, p: 2, boxShadow: 6, borderRadius: '4px' }}>
            <CardHeader title="Thank you!" sx={{ textAlign: 'center' }} ></CardHeader>
            <CardContent>
              <Divider />
              <Grid container spacing={2} justifyContent="center">
                
                <Grid item xs={12} >
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography variant='h6' component="h3">Order Summary:</Typography>
                    <Typography variant='h6'>Total: {order.total}</Typography>
                  </Box>
                </Grid>

                <Grid item xs={12} md={5}>
                  <List sx={{ p: 0 }}>
                    {order.purchasedItems.map((item, index) => {
                      const options = [];
                      if (item.product_option) {
                        if (item.product_option.option_1) {
                          options.push(`${item.product_option.option_1.option_group.name}: ${item.product_option.option_1.name}`);
                        }
                        if (item.product_option.option_2) {
                          options.push(`${item.product_option.option_2.option_group.name}: ${item.product_option.option_2.name}`);
                        }
                        if (item.product_option.option_3) {
                          options.push(`${item.product_option.option_3.option_group.name}: ${item.product_option.option_3.name}`);
                        }
                      }
                      const optionsStr = options.length ? options.join('<br>') : '';

                      return (
                        <ListItem key={index} sx={{ mb: 1, mx: 0, p: 0, pl: 1}}>
                          <ListItemText
                            primary={`${item.name} (${item.quantity})`}
                            secondaryTypographyProps={{ component: 'div' }}
                            secondary={optionsStr && <div dangerouslySetInnerHTML={{ __html: optionsStr }}></div>}
                          />
                        </ListItem>
                      );
                    })}
                  </List>
                </Grid>

                <Grid item xs={1}>
                  <Divider orientation="vertical"/>
                </Grid>

                <Grid item xs={12} md={6}>
                  <Typography variant="h6" component="h4">Ship To:</Typography>
                  <Grid container sx={{ mt: 1, textAlign: 'left' }}>
                    <Grid item xs={3}>
                      <Typography>Name:</Typography>
                      <Typography>Address:</Typography>
                      {order.shippingInfo.addressLine2 && <br></br>}
                      <Typography>City:</Typography>
                      <Typography>State:</Typography>
                      <Typography>ZIP Code:</Typography>
                    </Grid>
                    <Grid item xs={9} sx={{textAlign: 'right'}}>
                      <Typography>{order.shippingInfo.name}</Typography>
                      <Typography>{order.shippingInfo.addressLine1}</Typography>
                      {order.shippingInfo.addressLine2 &&
                        <Typography>{order.shippingInfo.addressLine2}</Typography>
                      }
                      <Typography>{order.shippingInfo.city}</Typography>
                      <Typography>{order.shippingInfo.state}</Typography>
                      <Typography>{order.shippingInfo.zip}</Typography>
                    </Grid>
                  </Grid>
                </Grid>

                <Grid item xs={12}>
                  <Divider />
                </Grid>

                <Grid item xs={12} md={6}>
                  <Typography textAlign={'center'}>
                    Receive updates about your order?
                  </Typography>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <TextField
                      label="Email"
                      value={userEmail}
                      onChange={(e) => setUserEmail(e.target.value)}
                      variant="outlined"
                      size="small"
                      sx={{ mt: 1 }}
                    />
                    <Button
                      variant="contained"
                      size="small"
                      onClick={sendEmailToUser}
                      sx={{ mt: 1, ml: 1 }}
                    >
                      Submit
                    </Button>
                  </Box>
                  
                </Grid>

              </Grid>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        TransitionComponent={Slide}
        onClose={() => setSnackbarOpen(false)}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <MuiAlert onClose={() => setSnackbarOpen(false)} severity={snackbarType} elevation={6} variant="filled">
          {snackbarType === 'success' ? 'An order summary will be sent to your email within 48 hours.' : 'Failed to set up order updates!'}
        </MuiAlert>
      </Snackbar>

    </Container>
  );
};

export default PaymentComplete;