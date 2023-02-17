const router = require('express').Router();
const { Product, Category, Tag, ProductTag, ProductOption } = require('../../models');

// the `/api/products` endpoint

// get all products (and associated category and productOptions)
// GET /api/products
router.get('/', (req, res) => {
  Product.findAll({
    include: [
      Category,
      ProductOption
    ]
  })
    .then(dbPostData => res.json(dbPostData))
    .catch(err => {
      console.log(err);
      res.status(500).json(err);
    });
});

// get one product by id (and associated category and productOptions)
// GET /api/products/1
router.get('/:id', (req, res) => {
  Product.findOne({
    where: { id: req.params.id },
    include: [
      Category,
      ProductOption
    ]
  })
    .then(dbProductData => {
      if (!dbProductData) {
        res.status(404).json({ message: 'Unable to find product with this id' });
        return;
      }
      res.json(dbProductData)})
    .catch(err => {
      console.log(err);
      res.status(500).json(err);
    })
});

// create new product
// POST /api/products
/* req.body should look like this...
  {
    product_name: "Basketball",
    description: "A bouncy ball for shooting hoops.",            // optional
    price: 200.00, <------------------ this price is the default price (if no product options)           //optional
    stock: 10,               // optional
    category_id: 1                // optional
  }
*/
router.post('/', (req, res) => {
  Product.create(req.body)
    .then(dbProductData => res.json(dbProductData))
    .catch((err) => {
      console.log(err);
      res.status(500).json(err);
    });
});

// bulk create new product options by product id and optionGroup id
// POST /api/products/1/options/groups
// TODO ?
router.post('/:id/options/groups', (req, res) => {

});

// update product by id
// PUT /api/products/1
router.put('/:id', (req, res) => {
  // update product data
  Product.update(req.body, {
    where: {
      id: req.params.id,
    },
  })
    .then((dbProductData) => res.json(dbProductData))
    .catch((err) => {
      console.log(err);
      res.status(500).json(err);
    });
});

// delete product by id, and associated product options
// DELETE /api/products/1
router.delete('/:id', (req, res) => {
  Product.destroy({
    where: { id: req.params.id }
  })
  .then(dbProductData => {
    if(!dbProductData) {
      res.status(400).json({ message: 'Unable to find product with this id' });
      return;
    }
    res.json({dbProductData})
  })
  .catch(err => {
    console.log(err);
    res.status(500).json(err);
  })
});

// delete a single product option by id
// DELETE /api/products/1/options/1
// TODO
router.delete('/:id/options/:id', (req, res) => {

});

module.exports = router;