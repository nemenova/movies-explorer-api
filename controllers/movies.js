/* eslint-disable no-undef */
const Movie = require('../models/movie');
const NotFoundError = require('../errors/NotFoundError');
const BadRequestError = require('../errors/BadRequestError');
// const AuthError = require('../errors/AuthError');

module.exports.getMovies = (req, res, next) => {
  Movie.find({})
    .then((movies) => res.send({ movies }))
    .catch(next);
};

module.exports.createMovie = (req, res, next) => {
  // const owner = req.user._id;
  const {
    country,
    director,
    duration,
    year,
    description,
    image,
    trailer,
    thumbnail,
    movieId,
    nameRU,
    nameEN,
  } = req.body;

  Movie.create({
    country,
    director,
    duration,
    year,
    description,
    image,
    trailer,
    thumbnail,
    movieId,
    nameRU,
    nameEN,
  })
    .then((movie) => res.send(movie))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        throw new BadRequestError('Переданы некорректные данные при создании карточки.');
      } else {
        next(err);
      }
    })
    .catch(next);
};

module.exports.deleteMovie = (req, res, next) => {
  const { movieId } = req.params;
  Movie.findById(movieId)
    .then((movie) => {
      if (!movie) {
        throw new NotFoundError('Нет такого фильма');
      }
      // else (JSON.stringify(req.user._id) === JSON.stringify(movie.owner)) {
      Movie.findByIdAndRemove(movieId)
        .then((result) => {
          res.send(result);
        });
      // }
      // else {
      //   throw new AuthError('Нельзя удалять чужие карточки');
      // }
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

// module.exports.likeCard = (req, res, next) => {
//   Card.findByIdAndUpdate(
//     req.params.movieId,
//     { $addToSet: { likes: req.user._id } },
//     { new: true },
//   )
//     .then((card) => {
//       if (!card) {
//         throw new NotFoundError('Нет такой карточки');
//       }
//       res.send(card);
//     })
//     .catch((err) => {
//       if (err.name === 'CastError') {
//         throw new BadRequestError('Переданы некорректные данные');
//       } else {
//         next(err);
//       }
//     })
//     .catch(next);
// };

// module.exports.dislikeCard = (req, res, next) => {
//   Movie.findByIdAndUpdate(
//     req.params.movieId,
//     { $pull: { likes: req.user._id } },
//     { new: true },
//   )
//     .then((movie) => {
//       if (!movie) {
//         throw new NotFoundError('Нет такой карточки');
//       }
//       res.send(movie);
//     })
//     .catch((err) => {
//       if (err.name === 'CastError') {
//         throw new BadRequestError('Переданы некорректные данные');
//       } else {
//         next(err);
//       }
//     })
//     .catch(next);
// };
