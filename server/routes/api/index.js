const router = require('express').Router();

const userRoutes = require('./user-routes.js');
const productRoutes = require('./product-routes.js');
const categoryRoutes = require('./category-routes.js');
const optionRoutes = require('./option-routes.js');
const orderRoutes = require('./order-routes');

router.use('/users', userRoutes);
router.use('/products', productRoutes);
router.use('/categories', categoryRoutes);
router.use('/options', optionRoutes);
router.use('/orders', orderRoutes);

module.exports = router;