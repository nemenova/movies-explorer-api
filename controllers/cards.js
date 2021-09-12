/* eslint-disable no-undef */
const Card = require('../models/card');
const NotFoundError = require('../errors/NotFoundError');
const BadRequestError = require('../errors/BadRequestError');
const AuthError = require('../errors/AuthError');

module.exports.getCards = (req, res, next) => {
  Card.find({})
    .then((cards) => res.send({ cards }))
    .catch(next);
};

module.exports.createCard = (req, res, next) => {
  const owner = req.user._id;
  const { name, link } = req.body;

  Card.create({ name, link, owner })
    .then((card) => res.send(card))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        throw new BadRequestError('Переданы некорректные данные при создании карточки.');
      } else {
        next(err);
      }
    })
    .catch(next);
};

module.exports.deleteCard = (req, res, next) => {
  const { cardId } = req.params;
  Card.findById(cardId)
    .then((card) => {
      if (!card) {
        throw new NotFoundError('Нет такой карточки');
      } else if (JSON.stringify(req.user._id) === JSON.stringify(card.owner)) {
        Card.findByIdAndRemove(cardId)
          .then((result) => {
            res.send(result);
          });
      } else {
        throw new AuthError('Нельзя удалять чужие карточки');
      }
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        throw new BadRequestError('Переданы некорректные данные');
      } else {
        next(err);
      }
    })
    .catch(next);
};

module.exports.likeCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  )
    .then((card) => {
      if (!card) {
        throw new NotFoundError('Нет такой карточки');
      }
      res.send(card);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        throw new BadRequestError('Переданы некорректные данные');
      } else {
        next(err);
      }
    })
    .catch(next);
};

module.exports.dislikeCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true },
  )
    .then((card) => {
      if (!card) {
        throw new NotFoundError('Нет такой карточки');
      }
      res.send(card);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        throw new BadRequestError('Переданы некорректные данные');
      } else {
        next(err);
      }
    })
    .catch(next);
};
