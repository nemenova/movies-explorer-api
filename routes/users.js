const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
// const validator = require('validator');
const {
  getUser, updateProfile,
} = require('../controllers/users');

// const method = (value) => {
//   const result = validator.isEmail(value);
//   if (result) {
//     return value;
//   }
//   throw new Error('Email validation err');
// };

// router.get('/', getUsers);
router.get('/me', getUser);

// router.get('/:userId', celebrate({
//   params: Joi.object().keys({
//     userId: Joi.string().hex().length(24),
//   }),
// }), getUserById);

router.patch('/me', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    name: Joi.string().min(2).max(30).required(),
  }),
}), updateProfile);

// router.patch('/me/avatar', celebrate({
//   body: Joi.object().keys({
//     avatar: Joi.string().required().custom(method),
//   }),
// }), updateAvatar);

module.exports = router;
