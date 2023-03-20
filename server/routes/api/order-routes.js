const router = require('express').Router();
const { Order, OrderDetail } = require('../../models');
const withAuth = require('../../utils/auth');

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
const stripe = require("stripe")(process.env.STRIPE_SK_TEST)

// Calculate the order total on the server to prevent
// people from directly manipulating the amount on the client
// TODO
const calculateOrderAmount = (cart) => {

  console.log(cart)
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

  const total = subtotal + calculatedTax + calculatedShipping

  return parseFloat(total);
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

module.exports = router;