require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const helmet = require('helmet');
const cookieParser = require('cookie-parser');
const { Joi, celebrate, errors } = require('celebrate');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const validator = require('validator');
const userRoute = require('./routes/users');
const cardRoute = require('./routes/cards');
const { createUser, login, logout } = require('./controllers/users');
const auth = require('./middlewares/auth');
const NotFoundError = require('./errors/NotFoundError');
const centralErrorHandler = require('./middlewares/centralErrorHandler');
const { requestLogger, errorLogger } = require('./middlewares/logger');

const { PORT = 3000 } = process.env;
const app = express();

app.use(cors({
  credentials: true,
  origin: [
    'https://vnemenova.nomoredomains.rocks',
    'http://vnemenova.nomoredomains.rocks',
    'https://localhost:3000',
    'http://localhost:3000',
  ],
}));

mongoose.connect('mongodb://localhost:27017/mestodb', {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
  useUnifiedTopology: true,
});
app.use(helmet());
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(requestLogger);

app.get('/crash-test', () => {
  setTimeout(() => {
    throw new Error('Сервер сейчас упадёт');
  }, 0);
});

const method = (value) => {
  const result = validator.isURL(value);
  if (result) {
    return value;
  }
  throw new Error('URL validation err');
};

app.post('/signin', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required().min(8),
  }),
}), login);

app.post('/signup', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required().min(8),
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
    avatar: Joi.string().custom(method),
  }).unknown(true),
}), createUser);

app.use(auth);

app.get('/signout', logout);

app.use('/users', userRoute);
app.use('/cards', cardRoute);
app.use('*', () => {
  throw new NotFoundError('Запрашиваемый ресурс не найден.');
});

app.use(errorLogger);

app.use(errors());

app.use(centralErrorHandler);

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
});
app.set('trust proxy', 1);
app.use(limiter);

app.listen(PORT, () => {
  // Если всё работает, консоль покажет, какой порт приложение слушает
  // eslint-disable-next-line no-console
  console.log(`App listening on port ${PORT}`);
});
