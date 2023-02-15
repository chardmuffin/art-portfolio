const router = require('express').Router();

const userRoutes = require('./user-routes.js');
const productRoutes = require('./product-routes.js');
const tagRoutes = require('./tag-routes.js');

router.use('/users', userRoutes);
router.use('/products', productRoutes);
router.use('./tags', tagRoutes);

module.exports = router;