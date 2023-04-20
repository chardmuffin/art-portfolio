const router = require('express').Router();
const { Option, Product, ProductOption, OptionGroup, Category } = require('../../models');
const { Sequelize } = require('sequelize');
const withAuth = require('../../utils/auth');

// the `/api/options` and `/api/options/groups` endpoints

// find all options
// GET /api/options
router.get('/', (req, res) => {
  Option.findAll({
    include: OptionGroup,
    attributes: { exclude: ['option_group_id'] },
  })
    .then(dbOptionData => res.json(dbOptionData))
    .catch(err => {
      console.log(err);
      res.status(500).json(err);
    });
});

// find all option groups
// GET /api/options/groups
router.get('/groups', async (req, res) => {
  try {
    const optionGroups = await OptionGroup.findAll({
      include: [
        {
          model: Option,
          attributes: { exclude: ['option_group_id'] }
        }
      ],
      order: [
        ['id', 'ASC'],
        [{ model: Option }, 'id', 'ASC']
      ]
    });
    if (!optionGroups) {
      res.status(404).json({ message: 'No option groups found' });
    } else {
      res.json(optionGroups);
    }
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});


// find an option by id
// GET /api/options/1
router.get('/:id', (req, res) => {
  Option.findOne({
    where: { id: req.params.id },
    include: OptionGroup,
    attributes: {
      exclude: ['option_group_id'],
    },
  })
    .then(dbOptionData => res.json(dbOptionData))
    .catch(err => {
      console.log(err);
      res.status(500).json(err);
    })
});

// find an option group by id
// GET /api/options/groups/1
router.get('/groups/:id', (req, res) => {
  OptionGroup.findOne({
    where: { id: req.params.id },
    include: [
      {
        model: Option,
        attributes: { exclude: ['option_group_id'] }
      }
    ]
  })
    .then(dbOptionGroupData => res.json(dbOptionGroupData))
    .catch(err => {
      console.log(err);
      res.status(500).json(err);
    })
});

// create a new option
// POST /api/options
// expects {name: "Small", option_group_id: 1}
router.post('/', withAuth, (req, res) => {
  Option.create(req.body)
    .then(dbOptionData => res.json(dbOptionData))
    .catch(err => {
      console.log(err);
      res.status(500).json(err);
    })
});

// create a new option group
// POST /api/options/groups
// expects
//   {
//     name: "T-Shirt sizes"
//   }
router.post('/groups', withAuth, (req, res) => {
  OptionGroup.create(req.body)
    .then(dbOptionGroupData => res.json(dbOptionGroupData))
    .catch(err => {
      console.log(err);
      res.status(500).json(err);
    })
});

// update option by id
// PUT /api/options/1
// expects {name: "Small", option_group_id: 1}
router.put('/:id', withAuth, (req, res) => {
  Option.update(
    req.body,
    { where: { id: req.params.id } })
      .then(dbOptionData => {
        if (!dbOptionData) {
          res.status(404).json({ message: 'Unable to find option with this id' });
          return;
        }
        res.json(dbOptionData)
      })
      .catch(err => {
        console.log(err);
        res.status(500).json(err);
      })
});

// update option group by id
// PUT /api/options/groups/1
// expects
//   {
//     name: "T-Shirt sizes"
//   }
router.put('/groups/:id', withAuth, (req, res) => {
  OptionGroup.update(req.body, {
    where: {
      id: req.params.id
    }
  })
      .then(dbOptionGroupData => {
        if (!dbOptionGroupData) {
          res.status(404).json({ message: 'Unable to find option group with this id' });
          return;
        }
        res.json(dbOptionGroupData)
      })
      .catch(err => {
        console.log(err);
        res.status(500).json(err);
      })
});

// delete option by id
// DELETE /api/options/1
router.delete('/:id', withAuth, (req, res) => {
  Option.destroy({ where: { id: req.params.id } })
    .then(dbOptionData => {
      if (!dbOptionData) {
        res.status(404).json({ message: 'Unable to find option with this id' });
        return;
      }
      res.json(dbOptionData)
    })
    .catch(err => {
      console.log(err);
      res.status(500).json(err);
    })
});

// delete option group by id
// DELETE /api/options/groups/1
router.delete('/groups/:id', withAuth, (req, res) => {
  OptionGroup.destroy({ where: { id: req.params.id } })
    .then(dbOptionGroupData => {
      if (!dbOptionGroupData) {
        res.status(404).json({ message: 'Unable to find option group with this id' });
        return;
      }
      res.json(dbOptionGroupData)
    })
    .catch(err => {
      console.log(err);
      res.status(500).json(err);
    })
});

module.exports = router;