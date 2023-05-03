const router = require('express').Router();
const sgMail = require('@sendgrid/mail');
const { Order, OrderDetail } = require('../../models');
const { withAuth } = require('../../utils/helpers');

// the `/api/orders` endpoint

// get all orders with order details
// GET /api/orders
router.get('/', withAuth, (req, res) => {
  Order.findAll({
    include: OrderDetail
  })
    .then(dbOrderData => res.json(dbOrderData))
    .catch(err => {
      console.log(err);
      res.status(500).json(err);
    });
});

// get one order by id with order details
// GET /api/orders/1
router.get('/:id', withAuth, (req, res) => {
  Order.findOne({
    where: { id: req.params.id },
    include: OrderDetail
  })
    .then(dbOrderData => {
      if (!dbOrderData) {
        res.status(404).json({ message: 'No order found with this id' });
        return;
      }
      res.json(dbOrderData);
    })
    .catch(err => {
      console.log(err);
      res.status(500).json(err);
    });
});

// // TODO create new order with order details
// // POST /api/orders
// /* req.body should look like this...
//   {
//     status: 
//     total: 
//     address:
//   }
// */
// router.post('/', withAuth, (req, res) => {

// });

// ================================ STRIPE =========================================
const stripeApiKey = process.env.NODE_ENV === 'production'
  ? process.env.STRIPE_SK
  : process.env.STRIPE_SK_TEST;

const stripe = require("stripe")(stripeApiKey);

// Calculate the order total on the server to prevent
// people from directly manipulating the amount on the client
// TODO
const calculateOrderAmount = (cart) => {

  // calculate subtotal
  const calculateSubtotal = () => {
    return cart.reduce((accumulator, item) => {
      let price = parseFloat(item.price);
      if (item.product_option?.price_difference) {
        price = parseFloat(item.product_option.price_difference) + parseFloat(item.price);
      }
      return accumulator + (price * item.quantity);
    }, 0);
  };
  const subtotal = calculateSubtotal();

  // TODO
  // Sign up for TaxJar - API to calculate sales tax
  // https://www.taxjar.com/
  const taxRate = 0.1; // 10% tax rate
  const calculatedTax = subtotal * taxRate;

  // TODO
  // sign up for UPS API - calculate shipping, validate address
  // https://www.ups.com/upsdeveloperkit/downloadresource?loc=en_US
  const calculatedShipping = 10; // $10 fixed shipping cost

  const totalInCents = subtotal + calculatedTax + calculatedShipping * 100;

  return parseInt(totalInCents);
};

router.post("/create-payment-intent", async (req, res) => {
  const { cart } = req.body;

  // Create a PaymentIntent with the order amount and currency
  const paymentIntent = await stripe.paymentIntents.create({
    amount: calculateOrderAmount(cart),
    currency: "usd",
    automatic_payment_methods: {
      enabled: true,
    },
  });

  res.send({
    clientSecret: paymentIntent.client_secret,
  });
});


// ================================ SENDGRID =========================================
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

router.post('/send-order-summary', async (req, res) => {
  const { toEmail, name, subject, orderSummary } = req.body;

  // if toEmail is admin@artbychard.com, it is an email for the seller
  const templateId = toEmail === 'admin@artbychard.com' ? 'd-a5d948e081714402850208983db058c4' : 'd-f50d09fbf9aa44538dd59ebe902b35f8';

  const msg = {
    to: toEmail,
    from: 'admin@artbychard.com',
    templateId: templateId,
    dynamicTemplateData: {
      name,
      subject,
      orderSummary,
    },
  };

  try {
    await sgMail.send(msg);
    res.status(200).json({ message: 'Email sent successfully' });
  } catch (error) {
    console.error('Error sending email', error);
    res.status(500).json({ message: 'Error sending email' });
  }
});

router.post('/contact', async (req, res) => {
  const { name, subject, message, email, phone } = req.body;

  const msg = {
    to: 'admin@artbychard.com',
    from: 'admin@artbychard.com',
    templateId: 'd-406bf391e1674a2ab2be0b9a0d04e416',
    dynamicTemplateData: {
      name,
      subject,
      message,
      email,
      phone
    },
  };

  try {
    await sgMail.send(msg);
    res.status(200).json({ message: 'Email sent successfully' });
  } catch (error) {
    console.error('Error sending email', error);
    res.status(500).json({ message: 'Error sending email' });
  }
});

module.exports = router;