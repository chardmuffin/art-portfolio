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

// TODO create new order with order details
// POST /api/orders
/* req.body should look like this...
  {
    status: 
    total: 
    address:
  }
*/
router.post('/', withAuth, (req, res) => {

});

module.exports = router;