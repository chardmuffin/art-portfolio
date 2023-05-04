import { useState, useEffect, useCallback } from 'react';
import { Container, TextField, Button, Box, Grid, Snackbar, Typography, List, ListItem, ListItemText, CardHeader, CardContent, Card, Divider, Slide, useMediaQuery } from '@mui/material';
import MuiAlert from '@mui/material/Alert';
import { formatDate } from '../utils/helpers';
import axios from '../utils/axiosConfig';
import { useNavigate } from 'react-router-dom';

const PaymentComplete = ({ order, setOrder, setCart }) => {
  const navigate = useNavigate();
  const [toEmail, setToEmail] = useState('');
  const [submitEmail, setSubmitEmail] = useState('');
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarType, setSnackbarType] = useState('success');
  const smallScreen = useMediaQuery('(max-width: 600px)');

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
    const emailStr = submitEmail ? `${order.shippingInfo.name} provided an email address: ${submitEmail}\n` : '';
  
  return (
`${emailStr}${order.shippingInfo.name} purchased the following items on ${formatDate(order.orderDate)}:
${itemStr}

Status: ${order.status}

Order Total: ${order.total}
Ship to:
${order.shippingInfo.name}
${order.shippingInfo.addressLine1}
${order.shippingInfo.addressLine2}
${order.shippingInfo.city}, ${order.shippingInfo.state}, ${order.shippingInfo.zip}`
  
  )}, [order, submitEmail]);
  
  const sendEmailToUser = async () => {
    setSubmitEmail(toEmail);

    const data = {
      toEmail,
      name: order.shippingInfo.name,
      subject: 'Your Order Summary',
      orderSummary: stringifyOrder(),
    };
  
    try {
      await axios.post('/api/orders/send-order-summary', data);
      console.log('Order sent successfully to user');
      setSnackbarType('success');
    } catch (error) {
      console.error('Order failed to send to user', error);
      setSnackbarType('error');
    } finally {
      setSnackbarOpen(true);
    }
  };

  useEffect(() => {
    setCart(Array(0));
    
    const sendEmailToSeller = async () => {

      const subjectStr = submitEmail !== '' ? `CUSTOMER ${order.shippingInfo.name} has signed up for order updates via email.` : `CUSTOMER ${order.shippingInfo.name} HAS PLACED AN ORDER!`
      const data = {
        toEmail: 'admin@artbychard.com',
        name: order.shippingInfo.name,
        subject: subjectStr,
        orderSummary: stringifyOrder(),
      };
    
      try {
        await axios.post('/api/orders/send-order-summary', data);
        console.log('Order sent successfully to the seller');
        
        // update order status
        setOrder({
          ...order,
          status: 'IN PROCESS'
        })

        setSubmitEmail('');

      } catch (error) {
        console.error('Order failed to send to the seller', error);
      }
    };

    //redirect home if there is no order placed (user navigated here via url)
    !order.total
      ? navigate('/')
      : // only trigger email to seller if order exists and status is PENDING, or user provided email address
        (order.status === 'PENDING' || submitEmail !== '') && sendEmailToSeller();

  }, [order, setOrder, setCart, submitEmail, stringifyOrder, navigate])

  return (
    <Container component={'main'}>
      <Grid container spacing={2} justifyContent="center">
        <Grid item xs={12} md={8}>
          <Card sx={{ my: 8, p: 2, boxShadow: 6, borderRadius: '4px' }}>
            <CardHeader title="Thank you!" sx={{ textAlign: 'center' }} ></CardHeader>
            <CardContent>
              <Divider />
              <Grid container spacing={1} justifyContent="center">
                
                <Grid item xs={12} sm={6} sx={{ mb: { xs: 0, sm: 1 } }}>
                  <Typography variant='h6' component="h3">Order for {order.shippingInfo.name.split(' ')[0]}</Typography>
                </Grid>
                <Grid item xs={12} sm={6} sx={{ mb: { xs: 2, sm: 1 } }}>
                  <Typography sx={{ textAlign: { xs: 'left', sm: 'right' } }}>
                    {formatDate(order.orderDate)}
                  </Typography>
                </Grid>

                <Grid item xs={12} sm={5}>
                  <Typography>Items:</Typography>
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
                  <Typography variant='subtitle' component="h4">Total: {order.total}</Typography>
                </Grid>

                <Grid item xs={12} sm={1}>
                  <Divider orientation={ smallScreen ? "horizontal" : "vertical" }/>
                </Grid>

                <Grid item xs={12} sm={6}>
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

                <Grid item xs={12} sm={6}>
                  <Typography textAlign={'center'}>
                    Receive updates about your order?
                  </Typography>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <TextField
                      label="Email"
                      value={toEmail}
                      onChange={(e) => setToEmail(e.target.value)}
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
          {snackbarType === 'success' ? 'An order summary has been sent to your inbox.' : 'Failed to set up order updates!'}
        </MuiAlert>
      </Snackbar>

    </Container>
  );
};

export default PaymentComplete;