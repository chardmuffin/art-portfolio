const router = require('express').Router();
const { Category, Product } = require('../../models');
const { Sequelize } = require('sequelize');
const { withAuth } = require('../../utils/helpers');

// The `/api/categories` endpoint

// find all categories
// GET /api/categories
router.get('/', async (req, res) => {
  Category.findAll({
    attributes: [
      'id',
      'name',
      [Sequelize.literal('(SELECT COUNT(*) FROM product WHERE product.category_id = category.id)'), 'product_count']
    ],
    order: [
      ['id', 'ASC']
    ]
  })
    .then(dbCategoryData => res.json(dbCategoryData))
    .catch(err => {
      console.log(err);
      res.status(500).json(err);
    })
});

// find one category by its `id` value
// GET /api/categories/1
router.get('/:id', (req, res) => {
  Category.findOne({
    where: { id: req.params.id },
    attributes: [
      'name',
      [Sequelize.literal('(SELECT COUNT(*) FROM product WHERE product.category_id = category.id)'), 'product_count']
    ]
  })
    .then(dbCategoryData => res.json(dbCategoryData))
    .catch(err => {
      console.log(err);
      res.status(500).json(err);
    })
});

// create a new category
// POST /api/categories
// expects {name: "Books"}
router.post('/', withAuth, (req, res) => {
  Category.create(req.body)
    .then(dbCategoryData => res.json(dbCategoryData))
    .catch(err => {
      console.log(err);
      res.status(500).json(err);
    })
});

// update a category by its `id` value
// PUT /api/categories/1
// expects {name: "Books"}
router.put('/:id', withAuth, (req, res) => {
  Category.update(req.body, {
    where: { id: req.params.id }
  })
      .then(dbCategoryData => {
        if (!dbCategoryData) {
          res.status(404).json({ message: 'Unable to find category with this id' });
          return;
        }
        res.json(dbCategoryData)
      })
      .catch(err => {
        console.log(err);
        res.status(500).json(err);
      })
});

// delete a category by its `id` value
// DELETE /api/categories/1
router.delete('/:id', withAuth, (req, res) => {
  Category.destroy({ where: { id: req.params.id } })
    .then(dbCategoryData => {
      if (!dbCategoryData) {
        res.status(404).json({ message: 'Unable to find category with this id' });
        return;
      }
      res.json(dbCategoryData)
    })
    .catch(err => {
      console.log(err);
      res.status(500).json(err);
    })
});

module.exports = router;