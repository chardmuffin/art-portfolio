const router = require('express').Router();
const { Product, Category, Option, OptionGroup, ProductOption } = require('../../models');
const { Sequelize } = require('sequelize');

// the `/api/products` endpoint

// get all products
// GET /api/products
router.get('/', (req, res) => {
  Product.findAll({
    include: [
      Category,
      {
        model: ProductOption,
        attributes: []
      }
    ],
    attributes: {
      exclude: ['category_id'],
      include: [[Sequelize.literal('(SELECT COUNT(*) FROM product_option WHERE product_option.product_id = Product.id)'), 'product_option_count']]
    }
  })
    .then(dbPostData => res.json(dbPostData))
    .catch(err => {
      console.log(err);
      res.status(500).json(err);
    });
});

// get all product options
// GET /api/products/options
router.get('/options', (req, res) => {
  ProductOption.findAll({
    attributes: { exclude: ['product_id', 'option_id', 'option_group_id'] },
    include: [
      {
        model: Product,
        attributes: { exclude: ['category_id'] }
      },
      {
        model: Option,
        attributes: { exclude: ['option_group_id'] },
        include: OptionGroup
      }
    ]
  })
    .then(dbProductOptionData => res.json(dbProductOptionData))
    .catch(err => {
      console.log(err);
      res.status(500).json(err);
    });
});

// get one product by id
// GET /api/products/1
router.get('/:id', (req, res) => {
  Product.findOne({
    where: { id: req.params.id },
    include: [
      Category,
      {
        model: ProductOption,
        attributes: []
      }
    ],
    attributes: {
      exclude: ['category_id'],
      include: [[Sequelize.literal('(SELECT COUNT(*) FROM product_option WHERE product_option.product_id = Product.id)'), 'product_option_count']]
    }
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

// get a single product option by id
// GET /api/products/options/1
// TODO
router.get('/options/:id', (req, res) => {
  ProductOption.findOne({
    attributes: { exclude: ['product_id', 'option_id', 'option_group_id'] },
    include: [
      {
        model: Product,
        attributes: { exclude: ['category_id'] }
      },
      {
        model: Option,
        attributes: { exclude: ['option_group_id'] },
        include: OptionGroup
      }
    ],
    where: { id: req.params.id }
  })
    .then(dbProductOptionData => {
      if (!dbProductOptionData) {
        res.status(404).json({ message: 'Unable to find product option with this id' });
        return;
      }
      res.json(dbProductOptionData);
    })
    .catch(err => {
      console.log(err);
      res.status(500).json(err);
    });
});

// create new product
// POST /api/products
/* req.body should look like this...
  {
    product_name: "Basketball",
    description: "A bouncy ball for shooting hoops.",            // optional
    price: 200.00, <------------------ this price is the default price (if no product options)           //optional
    stock: 10,                    // optional
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

// ================================================ ProductOption Routes =======================================================

// create a single product option
// POST /api/products/options
// expects {
//   "option_price": 10.99,
//   "stock": 20,
//   "product_id": 1,
//   "option_id": 1
// }
router.post('/options', (req, res) => {
  ProductOption.create(req.body)
    .then(dbProductOptionData => res.json(dbProductOptionData))
    .catch(err => {
      console.log(err);
      res.status(500).json(err);
    });
});

// update a single product option by id
// PUT /api/products/options/1
// expects {
//   "option_price": 10.99,
//   "stock": 20,
//   "product_id": 1,
//   "option_id": 1
// }
router.put('/options/:id', (req, res) => {
  ProductOption.update(req.body, {
    where: {
      id: req.params.id
    }
  })
    .then(dbProductOptionData => {
      if (!dbProductOptionData[0]) {
        res.status(404).json({ message: 'Unable to find product option with this id' });
        return;
      }
      res.json(dbProductOptionData);
    })
    .catch(err => {
      console.log(err);
      res.status(500).json(err);
    });
});

// delete a single product option by id
// DELETE /api/products/options/1
// TODO
router.delete('/options/:id', (req, res) => {
  ProductOption.destroy({
    where: {
      id: req.params.id
    }
  })
    .then(dbProductOptionData => {
      if (!dbProductOptionData) {
        res.status(404).json({ message: 'Unable to find product option with this id' });
        return;
      }
      res.json(dbProductOptionData);
    })
    .catch(err => {
      console.log(err);
      res.status(500).json(err);
    });
});

module.exports = router;