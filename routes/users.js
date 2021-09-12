const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const {
  getUser, updateProfile, getUserById,
} = require('../controllers/users');

router.get('/me', getUser);

router.get('/:userId', celebrate({
  params: Joi.object().keys({
    userId: Joi.string().hex().length(24),
  }),
}), getUserById);

router.patch('/me', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    name: Joi.string().min(2).max(30).required(),
  }),
}), updateProfile);

module.exports = router;
