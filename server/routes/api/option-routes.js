const router = require('express').Router();
const { Option, ProductOption, OptionGroup } = require('../../models');

// the `/api/options` and `/api/options/groups` endpoints

// find all options
// GET /api/options
router.get('/', (req, res) => {
  Option.findAll({
    attributes: ['id', 'option_name'],
    include: [
      ProductOption,
      OptionGroup
    ]
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
          attributes: ['id', 'option_name']
        },
        ProductOption
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
    attributes: ['id', 'option_name'],
    where: { id: req.params.id },
    include: [
      ProductOption,
      OptionGroup
    ]
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
        attributes: ['id', 'option_name']
      },
      ProductOption
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
// expects {option_name: "Small", option_group_id: 1}
router.post('/', (req, res) => {
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
//     option_group_name: "T-Shirt sizes"
//   }
router.post('/groups', (req, res) => {
  OptionGroup.create(req.body)
    .then(dbOptionGroupData => res.json(dbOptionGroupData))
    .catch(err => {
      console.log(err);
      res.status(500).json(err);
    })
});

// update option by id
// PUT /api/options/1
// expects {option_name: "Small", option_group_id: 1}
router.put('/:id', (req, res) => {
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
//     option_group_name: "T-Shirt sizes"
//   }
router.put('/groups/:id', (req, res) => {
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
router.delete('/:id', (req, res) => {
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
router.delete('/groups/:id', (req, res) => {
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