import { useState, useEffect, useMemo, useCallback } from 'react';
import {
  useMediaQuery,
  Container,
  Typography,
  Box,
  Divider,
  Card,
  IconButton,
  Grid,
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

  // const smallScreen = useMediaQuery('(max-width: 600px)');
  const mediumScreen = useMediaQuery('(max-width: 900px)');

  // checkout page is split in shipping and payment stages using MUI stepper (mobile)
  const [activeStep, setActiveStep] = useState(0);

  const showStep1 = () => {
    setActiveStep(0);
  };

  const showStep2 = () => {
    setActiveStep(1);
  };

  // =============================================== process cart =======================================================

  // TODO
  // consolidate duplicate items (set quantity of each item)

  // populate subtotal panel with calculated amounts
  // calculate subtotal
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

  // set tax, shipping upon user enter zip code, calculate total
  const [tax, setTax] = useState("TBD");
  const [shipping, setShipping] = useState("TBD");
  const [total, setTotal] = useState("TBD");

  // calculate taxes and shipping costs based on the shipping address
  const calculateTaxesAndShipping = useCallback(() => {

    // Tax rate depending on zip
    // TODO
    const taxRate = 0.1; // 10% tax rate
    const calculatedTax = subtotal * taxRate;

    // Shipping rate depending on zip
    // TODO
    const calculatedShipping = 10; // $10 fixed shipping cost
    setTax(toMoneyFormat(calculatedTax));
    setShipping(toMoneyFormat(calculatedShipping));
    setTotal(toMoneyFormat(subtotal + calculatedTax + calculatedShipping));
  }, [subtotal]);

  // ================================================= 3 Panels ==========================================================
  // subtotal, tax, shipping, total
  const subtotalPanelContent = (
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

  // shipping address form (step 1 in mobile)
  const [shippingInfo, setShippingInfo] = useState({
    name: '',
    addressLine1: '',
    addressLine2: '',
    city: '',
    state: '',
    zip: '',
    phone: '',
  });

  // handle address submit
  const onAddressSubmit = async (values, formikHelpers) => {
    setShippingInfo(values);
    calculateTaxesAndShipping();
    formikHelpers.setSubmitting(false);

    // if on mobile, go to next step
    mediumScreen && showStep2();
    
    console.log(shippingInfo);
  };

  const shippingPanelContent = (
    !mediumScreen ? (
      <Card sx={{ boxShadow: 8, borderRadius: '4px' }}>
        <Box sx={{ m: 2 }}>
          <Typography variant="h5" component="h5">
            Shipping Information
          </Typography>
          <ShippingAddressForm
            onAddressSubmit={onAddressSubmit}
            mediumScreen={mediumScreen}
            shippingInfo={shippingInfo}
          />
        </Box>
      </Card>
    ) : (
      <>
        <StepLabel onClick={showStep1} sx={{ mb: 0, pt: 0 }}>
          Shipping Information
        </StepLabel>
        <StepContent >
          <Box sx={{ pt: 1 }}>
            <ShippingAddressForm
              onAddressSubmit={onAddressSubmit}
              mediumScreen={mediumScreen}
              shippingInfo={shippingInfo}
            />
          </Box>
        </StepContent>
      </>
    )
  );

  // ============= stripe panel ===============
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

  // stripe panel
  const paymentPanelContent = (
    clientSecret && (
      <Elements options={options} stripe={stripePromise}>
        <StripeCheckoutForm handleBack={showStep1}/>
      </Elements>
    )
  );

  // ============================= remove item from cart confirmation dialog ==================================
  // appears when removing an item from cart
  const [open, setOpen] = useState(false);
  const [itemToRemove, setItemToRemove] = useState({
    item: null,
    index: null
  });
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

  // ============================================== jsx =================================================
  return (
    <Container component={'main'}>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Typography variant='h3' component="h2" sx={{ my: 4, textAlign: 'center' }}>
            Checkout Page
          </Typography>
        </Grid>
      
      {cart.length === 0 ? (
        // the cart is empty ?
        <Grid item xs={12}>
          <Typography sx={{ my: 2, textAlign: 'center' }}>
            Cart is empty!
          </Typography>
        </Grid>
        
      ) : (
        // if cart is not empty
        // 1. iterate thru cart, displaying items...
        <>
          <Grid item xs={12} md={8}>
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

          {/*
              2. show 3 panels:
                - 1 with subtotal, tax, shipping, total
                - 1 with shipping address form
                - 1 with stripe payment information form
              mobile will tap label or button to step between shipping address and stripe payment form
            */}
          {!mediumScreen ? (
              
            // on desktop/tablet?
            <>
              <Grid item xs={4} sx={{ position: "sticky", top: "16px" }} >
                <Card sx={{ boxShadow: 8, borderRadius: '4px' }}>
                  <Box sx={{ m: 2 }}>
                    {subtotalPanelContent}
                  </Box>
                </Card>
              </Grid>

              <Grid item xs={8}>
                {shippingPanelContent}
              </Grid>

              <Grid item xs={8}>
                <Card sx={{ boxShadow: 8, borderRadius: '4px' }}>
                  <Typography variant='h5' component='h5' sx={{ m: 2, mb: 0 }}>
                    Payment Information
                  </Typography>
                  <Box sx={{ mx: 2 }}>
                    {paymentPanelContent}
                  </Box>
                </Card>
              </Grid>
            </>
          ) : (
            
            // else on mobile/small screen
            <>
              <Grid item xs={12}>
                {subtotalPanelContent}
              </Grid>

              <Stepper activeStep={activeStep} orientation='vertical' sx={{ m: 2 }}>

                <Step sx={{ mt: 2 }}>
                  {shippingPanelContent}
                </Step>
                
                <Step>
                  <StepLabel sx={{ pb: 0, }}>
                    Payment Information
                  </StepLabel>
                  <StepContent>
                    {paymentPanelContent}
                  </StepContent>
                </Step>

              </Stepper>
            </>
          )}

          {/* 3. Confirm remove item dialog popup */}
          <ConfirmRemoveItemDialog
            open={open}
            handleClose={handleClose}
            itemToRemove={itemToRemove}
          />
        </>
      )}

      </Grid>
    </Container>
  );
}

export default Checkout;