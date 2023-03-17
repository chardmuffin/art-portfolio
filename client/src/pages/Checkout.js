import { useState, useEffect, useMemo } from 'react';
import {
  useMediaQuery,
  Container,
  Typography,
  Box,
  Divider,
  Card,
  IconButton,
  Grid,
  Button,
  Stepper,
  Step,
  StepLabel,
  StepContent,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { toMoneyFormat } from '../utils/helpers';
import { Link } from 'react-router-dom';
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import axios from 'axios';

import StripeCheckoutForm from '../components/StripeCheckoutForm';
import ShippingAddressForm from '../components/ShippingAddressForm';
import ConfirmRemoveItemDialog from '../components/ConfirmRemoveItemDialog';

// Make sure to call loadStripe outside of a component’s render to avoid
// recreating the Stripe object on every render.
// This is your test publishable API key.
const stripePromise = loadStripe("pk_test_51MlxOtIkA32m3k4INfMqyq2Nz6gVgheu3Y7gEqKQgPDnWWj9fRum27YKOnzXScpsrPIkzUD7Hxz7Dy2COGz4nK2Z009J1lob6N");

const Checkout = ({ cart, handleRemoveItem, mode }) => {

  // checkout page is split in shipping and payment stages using MUI stepper
  const [activeStep, setActiveStep] = useState(0);

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };
  

  // confirmation dialog box appears when removing an item from cart
  const [open, setOpen] = useState(false);
  const [itemToRemove, setItemToRemove] = useState({
    item: null,
    index: null
  });

  // shipping address form in step 1
  const [formData, setFormData] = useState({
    name: '',
    addressLine1: '',
    addressLine2: '',
    city: '',
    state: '',
    zip: '',
    phone: '',
  });

  // const smallScreen = useMediaQuery('(max-width: 600px)');
  const mediumScreen = useMediaQuery('(max-width: 900px)');

  // =================================================== process cart ===============================================
  // TODO

  const subtotal = useMemo(() => {
    const calculateSubtotal = () => {
      return cart.reduce((accumulator, item) => {
        let price = parseFloat(item.price);
        if (item.product_option?.price_difference) {
          price = parseFloat(item.product_option.price_difference) + parseFloat(item.price);
        }
        return accumulator + price;
      }, 0);
    };
    return calculateSubtotal();
  }, [cart]);

  // consolidate duplicates (set quantity of each item)
  // TODO

  // TODO
  const [tax, setTax] = useState("TBD");
  const [shipping, setShipping] = useState("TBD");
  const [total, setTotal] = useState("TBD");

  const subtotalPanel = (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
        <Typography variant='h5'>Subtotal:</Typography>
        <Typography variant='h5'>{toMoneyFormat(subtotal)}</Typography>
      </Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
        <Typography variant='subtitle1'>Tax:</Typography>
        <Typography variant='subtitle1'>{tax}</Typography>
      </Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
        <Typography variant='subtitle1'>Shipping:</Typography>
        <Typography variant='subtitle1'>{shipping}</Typography>
      </Box>
      <Divider />
      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
        <Typography variant='h4'>Total:</Typography>
        <Typography variant='h4'>{total}</Typography>
      </Box>
    </Box>
  );

  // ============================= remove item from cart confirmation dialog ==================================
  const handleDialogOpen = (item, index) => {
    setItemToRemove({
      item: item,
      index: index
    })
    setOpen(true);
  };

  const handleClose = (isRemoving) => {
    setOpen(false);
    isRemoving && handleRemoveItem(itemToRemove.index);
  };
  
  // ====================================== stripe =====================================
  const [clientSecret, setClientSecret] = useState("");

  const createPaymentIntent = async (cart) => {
    try {
      const response = await axios.post('api/orders/create-payment-intent', cart);
      return response.data;
    } catch (error) {
      console.error('Error creating payment intent:', error);
      throw error;
    }
  };

  useEffect(() => {
    createPaymentIntent(cart)
      .then((data) => setClientSecret(data.clientSecret))
      .catch((error) => console.error('Error setting client secret:', error));
  }, [cart]);

  const appearance = {
    theme: mode === 'dark' ? 'night' : 'stripe',
  };
  const options = {
    clientSecret,
    appearance,
  };

  const shippingPanelContent = (
    <Box sx={{ my: 2 }}>
      {/* show panel with subtotal, tax, shipping, etc */}
      {cart.length > 0 && (
        !mediumScreen ? (
          <Card sx={{ boxShadow: 8, borderRadius: '4px', m: 2, mr: 0 }}>
            <Box sx={{ m: 2 }}>
              <ShippingAddressForm setFormData={setFormData} formData={formData}/>
            </Box>
          </Card>
        ) : (
          <Grid item xs={12} md={4}>
            <Box>
              <ShippingAddressForm setFormData={setFormData} formData={formData} />
            </Box>
          </Grid>
        )
      )}
    </Box>
  );

  const paymentPanelContent = (
    <>
      {clientSecret && (
        <Elements options={options} stripe={stripePromise}>
          <StripeCheckoutForm />
        </Elements>
      )}
    </>
  );

  // ============================================== jsx =================================================
  return (
    <Container component={'main'}>
      <Typography variant='h3' component="h2" sx={{ my: 4, textAlign: 'center' }}>Checkout Page</Typography>
  
      {cart.length === 0 &&
        <Typography sx={{ my: 2, textAlign: 'center' }}>
          Cart is empty!
        </Typography>
      }

      <Grid container spacing={2}>
        <Grid item xs={12} md={8}>

          {/* iterate thru cart, displaying items */}
          {cart.map((item, index) => {
            return (
              <Card key={index}
                sx={{
                  mx: 'auto',
                  mb: 2,
                  textAlign: 'left',
                  display: 'flex',
                  boxShadow: 8,
                  borderRadius: '2px',
                  position: 'relative'
                }}
              >
                <IconButton
                  aria-label="remove item"
                  onClick={() => handleDialogOpen(item, index)}
                  sx={{ position: 'absolute', top: '0px', right: '0px' }}>
                  <CloseIcon />
                </IconButton>

                <Box component={'img'}
                  src={`http://localhost:3001/api/products/images/${item.image.id}?width=100&height=150`}
                  alt={item.name}
                  loading="lazy"
                  sx={{
                    m: 2,
                    boxShadow: 20,
                    borderRadius: '2px',
                  }}
                />
                <Box sx={{ p: 1, my: 2, width: 1, fontStyle: 'italic', textAlign: 'left', letterSpacing: 2  }}>
                  <Box
                    component={Link}
                    to={`/products/${item.id}`}
                    sx={{
                      color: 'inherit',
                      textDecoration: 'none',
                      '&:hover': {
                        textDecoration: 'underline'
                      }
                    }}
                  >
                    <Typography variant='h5' component="h3" >
                      {item.name}
                    </Typography>
                  </Box>
                  <Box sx={{ mx: 2 }}>
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
              </Card>
            )
          })}
        </Grid>

        {/* show panel with subtotal, tax, shipping, etc */}
        {cart.length > 0 && (
          !mediumScreen ? (
            <Grid item md={4}>
              <Card sx={{ boxShadow: 8, borderRadius: '4px' }}>
                <Box sx={{ m: 2 }}>
                  {subtotalPanel}
                </Box>
              </Card>
            </Grid>
          ) : (
            <Grid item xs={12}>
              <Box>{subtotalPanel}</Box>
            </Grid>
          )
        )}

        {!mediumScreen ? (
          <Grid item xs={12}>
            {shippingPanelContent}
            {paymentPanelContent}
          </Grid>
        ) : (
          
          <Stepper activeStep={activeStep} orientation='vertical'>
            <Step sx={{ mt: 2 }}>
              <StepLabel>Shipping Information</StepLabel>
              <StepContent>
                {shippingPanelContent}
                <Button variant="contained" onClick={handleNext}>
                  Next
                </Button>
              </StepContent>
            </Step>
            
            <Step>
              <StepLabel>Payment Information</StepLabel>
              <StepContent>
                {paymentPanelContent}
                <Button variant="contained" onClick={handleBack}>
                  Back
                </Button>
              </StepContent>
            </Step>
          </Stepper>
        )}
      </Grid>
  
      <ConfirmRemoveItemDialog
        open={open}
        handleClose={handleClose}
        itemToRemove={itemToRemove}
      />
    </Container>
  );
}

export default Checkout;