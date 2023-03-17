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
const calculateOrderAmount = (items) => {

  console.log(items)

  // subtotal TODO
  const subtotal = 100;
  // const subtotal = items.reduce((accumulator, item) => {
  //   let price = parseFloat(item.price);
  //   if (item.product_option?.price_difference) {
  //     price = parseFloat(item.product_option.price_difference) + parseFloat(item.price);
  //   }
  //   return accumulator + price;
  // }, 0);

  // tax TODO
  const tax = 0;

  // shipping TODO
  const shipping = 0;

  // discounts TODO
  const discounts = 0;

  return subtotal + tax + shipping + discounts;
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