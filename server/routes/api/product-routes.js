const router = require('express').Router();
const { Product, Category, Option, OptionGroup, ProductOption, Image } = require('../../models');
const { Sequelize } = require('sequelize');
const sharp = require('sharp');
const fs = require('fs');
const path = require('path');
const withAuth = require('../../utils/auth');
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });

// the `/api/products` endpoint

// get all products
// GET /api/products
router.get('/', (req, res) => {
  Product.findAll({
    include: [
      Category,
      {
        model: Image,
        attributes: { exclude: ['data', 'product_id'] }
      },
      {
        model: ProductOption,
        attributes: []
      }
    ],
    attributes: {
      exclude: ['category_id'],
      include: [[Sequelize.literal('(SELECT COUNT(*) FROM product_option WHERE product_option.product_id = product.id)'), 'product_option_count']]
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
    attributes: { exclude: ['product_id', 'option_id_1', 'option_id_2', 'option_id_3', 'option_group_id'] },
    include: [
      {
        model: Product,
        attributes: { exclude: ['category_id'] }
      },
      {
        model: Option,
        as: 'option_1',
        attributes: ['id', 'name'],
        include: OptionGroup
      },
      {
        model: Option,
        as: 'option_2',
        attributes: ['id', 'name'],
        include: OptionGroup
      },
      {
        model: Option,
        as: 'option_3',
        attributes: ['id', 'name'],
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

// get all product images
// GET /api/products/images
// not used in production
router.get('/images', (req, res) => {
  Image.findAll({
    attributes: { exclude: ['data', 'product_id'] },
    include: {
      model: Product,
      attributes: { exclude: ['category_id'] }
    }
  })
    .then(dbImageData => res.json(dbImageData))
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
        model: Image,
        attributes: { exclude: ['data', 'product_id'] }
      },
      {
        model: ProductOption,
        attributes: []
      }
    ],
    attributes: {
      exclude: ['category_id'],
      include: [[Sequelize.literal('(SELECT COUNT(*) FROM product_option WHERE product_option.product_id = product.id)'), 'product_option_count']]
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

// get product options by product id
// GET /api/products/1/options
router.get('/:id/options', (req, res) => {
  Product.findOne({
    where: { id: req.params.id },
    include: [
      Category,
      {
        model: Image,
        attributes: { exclude: ['data', 'product_id'] }
      },
      {
        model: ProductOption,
        attributes: { exclude: ['product_id', 'option_id_1', 'option_id_2', 'option_id_3', 'option_group_id'] },
        include: [          
          {
            model: Option,
            as: 'option_1',
            attributes: ['id', 'name'],
            include: OptionGroup
          },
          {
            model: Option,
            as: 'option_2',
            attributes: ['id', 'name'],
            include: OptionGroup
          },
          {
            model: Option,
            as: 'option_3',
            attributes: ['id', 'name'],
            include: OptionGroup
          }
        ]
      },
    ],
    attributes: { exclude: ['category_id'] }
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
router.get('/options/:id', (req, res) => {
  ProductOption.findOne({
    attributes: { exclude: ['product_id', 'option_id_1', 'option_id_2', 'option_id_3', 'option_group_id'] },
    where: { id: req.params.id },
    include: [
      {
        model: Product,
        attributes: { exclude: ['category_id'] }
      },
      {
        model: Option,
        as: 'option_1',
        attributes: ['id', 'name'],
        include: OptionGroup
      },
      {
        model: Option,
        as: 'option_2',
        attributes: ['id', 'name'],
        include: OptionGroup
      },
      {
        model: Option,
        as: 'option_3',
        attributes: ['id', 'name'],
        include: OptionGroup
      }
    ]
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

// get a single image by id (returns the actual buffer image, not the BLOB data)
// GET /api/products/images/1
router.get('/images/:id', (req, res) => {
  const { id } = req.params;
  const width = req.query.width ? parseInt(req.query.width, 10) : undefined;
  const height = req.query.height ? parseInt(req.query.height, 10) : undefined;

  Image.findByPk(id)
    .then(dbImageData => {
      if (!dbImageData) {
        res.status(404).json({ message: 'Unable to find image with this id' });
        return;
      }

      //apply max width and/or height and send resized image
      const pipeline = sharp(dbImageData.data);
      if (width || height) {
        pipeline.resize(width, height, { fit: 'inside' });
      }

      pipeline.toBuffer((err, data, info) => {
        res.set('Content-Type', 'image/jpeg');
        res.send(data);
      });
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
    name: "Basketball",
    description: "A bouncy ball for shooting hoops.",                                         // optional
    price: 200.00, <---- this price is the (required) default price (if no product options)
    stock: 10,                                                                                // optional
    category_id: 1                                                                            // optional
  }   
*/
router.post('/', withAuth, (req, res) => {
  Product.create(req.body)
    .then(dbProductData => res.json(dbProductData))
    .catch((err) => {
      console.log(err);
      res.status(500).json(err);
    });
});

// update product by id
// PUT /api/products/1
/* req.body should resemble this...
  {
    name: "Basketball",
    description: "A bouncy ball for shooting hoops.",                                         // optional
    price: 200.00, <---- this price is the (required) default price (if no product options)
    stock: 10,                                                                                // optional
    category_id: 1                                                                            // optional
    image_id: 1                                                                               // optional
  }   
*/
router.put('/:id', withAuth, (req, res) => {
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

// delete product by id, and associated product options and image
// DELETE /api/products/1
router.delete('/:id', withAuth, (req, res) => {
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
//   "option_id_1": 1,
//   "option_id_2": 4,        //optional
//   "option_id_3": 7         //optional
// }
router.post('/options', withAuth, (req, res) => {
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
//   "option_id_1": 1,
//   "option_id_2": 4,
//   "option_id_3": 7
// }
router.put('/options/:id', withAuth, (req, res) => {
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
router.delete('/options/:id', withAuth, (req, res) => {
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

// ================================================ Product Image Routes =======================================================

// create a single product image
// POST /api/products/images
router.post('/images', withAuth, upload.single('image'), (req, res) => {
  const { product_id } = req.body;

  if (!req.file) {
    res.status(400).json({ message: 'Image file is required' });
    return;
  }

  // Read the image file from the uploaded file
  const imagePath = req.file.path;

  sharp(imagePath)
    .toBuffer((err, data) => {
      if (err) {
        console.log(err);
        res.status(500).json(err);
        return;
      }

      // Create the Image object with the buffer data
      Image.create({ filename: req.file.originalname, data, product_id })
        .then(dbImageData => res.json(dbImageData))
        .catch(err => {
          console.log(err);
          res.status(500).json(err);
        });
    });
});

// update a single product image by id
// PUT /api/products/images/1
// expects {
//   "filename": 'artie.jpg'   // optional
//   "product_id": 1           // optional
// }
router.put('/images/:id', withAuth, async (req, res) => {
  const { id } = req.params;
  const { filename, product_id } = req.body;
  try {
    const dbImageData = await Image.findByPk(id);
    if (!dbImageData) {
      res.status(404).json({ message: 'Unable to find product image with this id' });
      return;
    }

    if (filename) {
      dbImageData.filename = filename;
    }
    if (product_id) {
      dbImageData.product_id = product_id;
    }

    // update data based on filename
    const imagePath = path.join(__dirname, '../../../client/src/assets/images/products/', dbImageData.filename);
    let data = await fs.promises.readFile(imagePath);

    // store image data as BLOB using sharp
    data = await sharp(data).toBuffer();
    dbImageData.data = data;

    await dbImageData.save();

    res.json(dbImageData);
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

// delete a single product image by id
// DELETE /api/products/images/1
router.delete('/images/:id', withAuth, (req, res) => {
  Image.destroy({
    where: {
      id: req.params.id
    }
  })
    .then(dbImageData => {
      if (!dbImageData) {
        res.status(404).json({ message: 'Unable to find product image with this id' });
        return;
      }
      res.json(dbImageData);
    })
    .catch(err => {
      console.log(err);
      res.status(500).json(err);
    });
});

module.exports = router;