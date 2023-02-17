const router = require('express').Router();
const { Category, Product } = require('../../models');

// The `/api/categories` endpoint

// find all categories
// GET /api/categories
router.get('/', async (req, res) => {
  Category.findAll({
    include: Product
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
    include: Product
  })
    .then(dbCategoryData => res.json(dbCategoryData))
    .catch(err => {
      console.log(err);
      res.status(500).json(err);
    })
});

// create a new category
// POST /api/categories
// expects {category_name: "Books"}
router.post('/', (req, res) => {
  Category.create(req.body)
    .then(dbCategoryData => res.json(dbCategoryData))
    .catch(err => {
      console.log(err);
      res.status(500).json(err);
    })
});

// update a category by its `id` value
// PUT /api/categories/1
// expects {category_name: "Books"}
router.put('/:id', (req, res) => {
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
router.delete('/:id', (req, res) => {
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