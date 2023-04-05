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
  CardActions,
  CardHeader, 
  ButtonGroup,
  Button,
  StepContent,
  CardMedia,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { toMoneyFormat } from '../utils/helpers';
import { Link } from 'react-router-dom';
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import axios from '../utils/axiosConfig';
import Sticky from 'react-stickynode';

import StripeCheckoutForm from '../components/StripeCheckoutForm';
import ShippingAddressForm from '../components/ShippingAddressForm';
import ConfirmRemoveItemDialog from '../components/ConfirmRemoveItemDialog';

// Make sure to call loadStripe outside of a component’s render to avoid
// recreating the Stripe object on every render.
// This is your test publishable API key.
const stripePromise = loadStripe("pk_test_51MlxOtIkA32m3k4INfMqyq2Nz6gVgheu3Y7gEqKQgPDnWWj9fRum27YKOnzXScpsrPIkzUD7Hxz7Dy2COGz4nK2Z009J1lob6N");

const Checkout = ({ cart, setCart, handleRemoveItem, mode, setOrder }) => {

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

  // ======================================================= process cart ============================================================

  // handle change in item quantity
  const handleQuantityChange = (index, action) => {
    const newCart = [...cart];
    const updatedQuantity =
      action === 'increment'
        ? newCart[index].quantity + 1
        : newCart[index].quantity - 1;
  
    if (updatedQuantity === 0) {
      // Set the itemToRemove if the quantity reaches zero
      // open confirm remove item dialog
      handleDialogOpen(newCart[index], index);
      return;
    }
  
    newCart[index].quantity = updatedQuantity;
    setCart(newCart);
  };
  
  // calculate subtotal
  const subtotal = useMemo(() => {
    const calculateSubtotal = () => {
      return cart.reduce((accumulator, item) => {
        let price = parseFloat(item.price);
        if (item.product_option?.price_difference) {
          price = parseFloat(item.product_option.price_difference) + parseFloat(item.price);
        }
        return accumulator + (price * item.quantity);
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

    // TODO
    // Sign up for TaxJar - API to calculate sales tax
    // https://www.taxjar.com/
    const taxRate = 0.1; // 10% tax rate
    const calculatedTax = subtotal * taxRate;

    // TODO
    // sign up for UPS API - calculate shipping, validate address
    // https://www.ups.com/upsdeveloperkit/downloadresource?loc=en_US
    //const cartCount = cart.reduce((total, item) => total + item.quantity, 0);
    const cartCount = 2;
    const calculatedShipping = 10 + 10 * (cartCount / 2);

    setTax(toMoneyFormat(calculatedTax));
    setShipping(toMoneyFormat(calculatedShipping));
    setTotal(toMoneyFormat(subtotal + calculatedTax + calculatedShipping));
  }, [subtotal]);

  // ================================================= 3 Panels ==========================================================
  // ====================== shipping address form (step 1 in mobile) =================
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

    // go to next step
    showStep2();
  };

  const shippingPanelContent = (
    !mediumScreen ? (
      <Card sx={{ boxShadow: 8, borderRadius: '4px', mt: 2 }}>
        <CardHeader title='Shipping Information' />
          <Box sx={{ mx: 2, mb: 2 }}>
            <ShippingAddressForm
              onAddressSubmit={onAddressSubmit}
              mediumScreen={mediumScreen}
              shippingInfo={shippingInfo}
            />
          </Box>
      </Card>
    ) : (
      <Box sx={{ pt: 1 }}>
        <ShippingAddressForm
          onAddressSubmit={onAddressSubmit}
          mediumScreen={mediumScreen}
          shippingInfo={shippingInfo}
        />
      </Box>
    )
  );

  // ============================= stripe payment panel ==================================
  const [clientSecret, setClientSecret] = useState("");

  const createPaymentIntent = async (cart) => {
    if (cart.length > 0) {
      try {
        const response = await axios.post('api/orders/create-payment-intent', { cart });
        return response.data;
      } catch (error) {
        console.error('Error creating payment intent:', error);
        throw error;
      }
    }
  };

  useEffect(() => {
    cart.length > 0 &&
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
        <StripeCheckoutForm
          handleBack={showStep1}
          shippingInfo={shippingInfo}
          setOrder={setOrder}
          cart={cart}
        />
      </Elements>
    )
  );

  // ================== subtotal, tax, shipping, total panel ====================
  // recalculate each time shipping info or subtotal changes (subtotal updates as cart updates)
  useEffect(() => {
    shippingInfo.name !== '' && calculateTaxesAndShipping();
  }, [subtotal, shippingInfo, calculateTaxesAndShipping]);

  const subtotalPanelContent = (
    <Box sx={{ textAlign: 'center' }}>
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
      <Divider sx={{ my: 1 }} />
      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
        <Typography variant='h4'>Total:</Typography>
        <Typography variant='h4'>{total}</Typography>
      </Box>
      {total === "TBD" && <Typography variant="caption">Enter address for shipping and tax estimate.</Typography>}
    </Box>
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

  const handleClose = (isConfirmed) => {
    setOpen(false);
    isConfirmed && handleRemoveItem(itemToRemove.index);
  };

  // ============================================== Checkout Page jsx =================================================
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

                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <CardMedia
                        sx={{ width: 120, boxShadow: 16, borderRadius: "2px", m: 2}}
                        component="img"
                        image={`http://localhost:3001/api/products/images/${item.image.id}?width=120`}
                        title={item.name}
                      />
                    </Box>
                                
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
                        <Grid container spacing={2}>
                          <Grid item xs={12} sm={6}>
                            <Typography variant='subtitle2'>
                              Price: {toMoneyFormat(item.product_option?.price_difference ?
                                parseFloat(item.product_option.price_difference) + parseFloat(item.price)
                                : item.price)}
                            </Typography>
                          </Grid>
                          <Grid item xs={12} sm={6}>
                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                              <Typography variant='subtitle2'>Quantity: </Typography>
                              <CardActions>
                                <ButtonGroup size="small" aria-label="small outlined button group"
                                  sx={{
                                    '& .MuiButton-root': {
                                      p: 0,
                                      minWidth: '24px',
                                    }
                                  }}
                                >
                                  <Button onClick={() => handleQuantityChange(index, 'decrement')}>
                                    <Typography>–</Typography>
                                  </Button>
                                  <Button disabled>
                                    <Typography>
                                      {item.quantity}
                                    </Typography>
                                  </Button>
                                  <Button onClick={() => handleQuantityChange(index, 'increment')}>
                                    <Typography>+</Typography>
                                  </Button>
                                </ButtonGroup>
                              </CardActions>
                            </Box>
                          </Grid>
                        </Grid>
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
                <Grid item xs={4}>
                  <Sticky top={16} innerZ={1000}>
                    <Card sx={{ boxShadow: 8, borderRadius: '4px' }}>
                      <Box sx={{ m: 2 }}>
                        {subtotalPanelContent}
                      </Box>
                    </Card>
                  </Sticky>
                </Grid>

                <Grid item xs={8}>
                  <Stepper activeStep={activeStep}>
                    <Step>
                      {/* If looking at step 2, step 1 label becomes a link back to step 1 */}
                      <StepLabel onClick={showStep1} sx={{ '&:hover': { textDecoration: activeStep === 1 ? "underline" : "none" } }}>Shipping Information</StepLabel>
                    </Step>
                    <Step>
                      <StepLabel>Payment</StepLabel>
                    </Step>
                  </Stepper>
            
                  {activeStep === 0 && shippingPanelContent }

                  {activeStep === 1 &&              
                    <Card sx={{ boxShadow: 8, borderRadius: '4px', mt: 2 }}>
                      <CardHeader title='Payment Information' sx={{ pb: 0 }}/>
                      <Box sx={{ mx: 2, }}>
                        {paymentPanelContent}
                      </Box>
                    </Card>
                  }
                </Grid>
              </>
            ) : (
              
              // else on mobile/small screen
              <Grid item xs={12}>
                {subtotalPanelContent}

                <Stepper activeStep={activeStep} orientation='vertical'>

                  <Step sx={{ mt: 2 }}>
                    <StepLabel onClick={showStep1} sx={{ mb: 0, pt: 0 }}>
                      Shipping Information
                    </StepLabel>
                    <StepContent>
                      {shippingPanelContent}
                    </StepContent>
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
              </Grid>
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