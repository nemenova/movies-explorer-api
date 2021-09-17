const router = require('express').Router();
const { validateUser } = require('../middlewares/validation');
const {
  getUser, updateProfile,
} = require('../controllers/users');

router.get('/me', getUser);

router.patch('/me', validateUser, updateProfile);

module.exports = router;
