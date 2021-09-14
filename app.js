require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const helmet = require('helmet');
const cookieParser = require('cookie-parser');
const { Joi, celebrate, errors } = require('celebrate');
const cors = require('cors');
const limiter = require('./middlewares/limiter');
// const validator = require('validator');
const userRoute = require('./routes/users');
const movieRoute = require('./routes/movies');
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

mongoose.connect('mongodb://localhost:27017/bitfilmsdb', {
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
  }).unknown(true),
}), createUser);

app.use(auth);

app.get('/signout', logout);

app.use('/users', userRoute);
app.use('/movies', movieRoute);
app.use('*', () => {
  throw new NotFoundError('Запрашиваемый ресурс не найден.');
});

app.use(errorLogger);

app.use(errors());

app.use(centralErrorHandler);

app.set('trust proxy', 1);
app.use(limiter);

app.listen(PORT, () => {
  // Если всё работает, консоль покажет, какой порт приложение слушает
  console.log(`App listening on port ${PORT}`);
});
