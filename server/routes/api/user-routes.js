const router = require('express').Router();
const { User } = require('../../models');

// the `/api/users` endpoint

// get all users
// GET /api/users
router.get('/', (req, res) => {
  User.findAll({
    attributes: { exclude: ['password'] }
  })
    .then(dbUserData => res.json(dbUserData))
    .catch(err => {
      console.log(err);
      res.status(500).json(err);
    });
});

// get a single user by id
// GET /api/users/1
router.get('/:id', (req, res) => {
  User.findOne({
    attributes: { exclude: ['password'] },
    where: {
      id: req.params.id
    }
  })
    .then(dbUserData => {
      if (!dbUserData) {
        res.status(404).json({ message: 'Cannot find user with that id!' });
        return;
      }
      res.json(dbUserData);
    })
    .catch(err => {
      console.log(err);
      res.status(500).json(err);
    });
});

// create a new user
// POST /api/users
// expects {email: 'exampleUser@gmail.com', password: 'password1234'}
router.post('/', (req, res) => {
  User.create({
    email: req.body.email,
    password: req.body.password
  })
    .then(dbUserData => res.json(dbUserData))
    .catch(err => {
      console.log(err);
      res.status(500).json(err);
    });
});

// login
// POST /api/users/login
// expects {email: 'exampleUser@gmail.com', password: 'password1234'}
router.post('/login', (req, res) => {
  User.findOne({
    where: {
      email: req.body.email
    }
  })
    .then(async dbUserData => {
      if (!dbUserData) {
        res.status(400).json({ message: 'Email and/or password is not valid.' });
        return;
      }

      const isValidPassword = await dbUserData.checkPassword(req.body.password);
      if (!isValidPassword) {
        res.status(400).json({ message: 'Email and/or password is not valid.' });
        return;
      }

      res.json({ user: dbUserData, message: 'You are now logged in!' });
    });

});

// update user
// PUT /api/users/1
// expects {email: 'exampleUser@gmail.com', password: 'password1234'}
router.put('/:id', (req, res) => {
  User.update(req.body, {
    individualHooks: true,
    where: {
      id: req.params.id
    }
  })
    .then(dbUserData => {
      if (!dbUserData[0]) {
        res.status(404).json({ message: 'Cannot find user with that id!' });
        return;
      }
      res.json(dbUserData);
    })
    .catch(err => {
      console.log(err);
      res.status(500).json(err);
    });
});

// delete a user by id
// DELETE /api/users/1
router.delete('/:id', (req, res) => {
  User.destroy({
    where: {
      id: req.params.id
    }
  })
    .then(dbUserData => {
      if (!dbUserData) {
        res.status(404).json({ message: 'Cannot find user with that id!' });
        return;
      }
      res.json(dbUserData);
    })
    .catch(err => {
      console.log(err);
      res.status(500).json(err);
    });
});

module.exports = router;