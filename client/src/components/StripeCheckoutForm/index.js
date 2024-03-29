import { useEffect, useState } from "react";
import {
  PaymentElement,
  useStripe,
  useElements
} from "@stripe/react-stripe-js";
import { Button } from "@mui/material";
import { Box, Typography, CircularProgress } from "@mui/material";

const StripeCheckoutForm = ({ handleBack, shippingInfo, setOrder, total, cart }) => {
  const stripe = useStripe();
  const elements = useElements();

  const [message, setMessage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!stripe) {
      return;
    }

    const clientSecret = new URLSearchParams(window.location.search).get(
      "payment_intent_client_secret"
    );

    if (!clientSecret) {
      return;
    }

    stripe.retrievePaymentIntent(clientSecret).then(({ paymentIntent }) => {
      switch (paymentIntent.status) {
        case "succeeded":
          setMessage("Payment succeeded!");
          break;
        case "processing":
          setMessage("Your payment is processing.");
          break;
        case "requires_payment_method":
          setMessage("Your payment was not successful, please try again.");
          break;
        default:
          setMessage("Something went wrong.");
          break;
      }
    });
  }, [stripe]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!stripe || !elements) {
      // Stripe.js has not yet loaded.
      // Make sure to disable form submission until Stripe.js has loaded.
      return;
    }

    setIsLoading(true);

    // Create the order object in state & localstorage
    setOrder({
      purchasedItems: cart,
      shippingInfo: shippingInfo,
      total: total,
      orderDate: new Date().toISOString(),
      status: 'PENDING'
    });

    const urlRoot = process.env.NODE_ENV === 'production' ? process.env.REACT_APP_API_BASE_URL : 'http://localhost:3000';
    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        // Make sure to change this to your payment completion page
        return_url: `${urlRoot}/payment-complete`
      },
    });

    // This point will only be reached if there is an immediate error when
    // confirming the payment. Otherwise, your customer will be redirected to
    // your `return_url`. For some payment methods like iDEAL, your customer will
    // be redirected to an intermediate site first to authorize the payment, then
    // redirected to the `return_url`.
    if (error.type === "card_error" || error.type === "validation_error") {
      setMessage(error.message);
    } else {
      setMessage("An unexpected error occurred.");
    }

    setIsLoading(false);
  };

  const paymentElementOptions = {
    layout: "tabs"
  }

  return (
    <Box sx={{ textAlign: 'center' }}>
      <Box id="payment-element" sx={{ my: 2 }}>
        <PaymentElement options={paymentElementOptions} />
      </Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-around', mb: 2 }}>
        <Button variant="contained" onClick={handleBack} >
          <Typography variant='button'>Back</Typography>
        </Button>
        <Button
          variant="outlined"
          disabled={isLoading || !stripe || !elements}
          id="submit"
          type="submit"
          onClick={handleSubmit}
        >
          {isLoading ? (
            <CircularProgress size={20} />
          ) : (
            <Typography variant='button'>Place Order</Typography>
          )}
        </Button>
      </Box>
        
      {/* Show any error or success messages */}
      {message && (
        <Typography sx={{ mt: 2 }} variant="subtitle1" color={message.startsWith('Payment succeeded') ? 'success' : 'error'}>
          {message}
        </Typography>
      )}
    </Box>
  );
};

export default StripeCheckoutForm;