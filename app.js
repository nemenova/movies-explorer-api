require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const helmet = require('helmet');
const cookieParser = require('cookie-parser');
const { errors } = require('celebrate');
const cors = require('cors');
const routers = require('./routes/index');
const limiter = require('./middlewares/limiter');
const centralErrorHandler = require('./middlewares/centralErrorHandler');
const { requestLogger, errorLogger } = require('./middlewares/logger');
const { DEV_MONGO_URL } = require('./utils/dev-config');

const { PORT = 3000, NODE_ENV, MONGO_URL } = process.env;
const app = express();

app.use(cors({
  credentials: true,
  origin: [
    'https://frontend.nemenova.nomoredomains.monster',
    'http://frontend.nemenova.nomoredomains.monster',
    'https://localhost:3000',
    'http://localhost:3000',
    'https://localhost:3001',
    'http://localhost:3001',
  ],
}));

mongoose.connect(NODE_ENV === 'production' ? MONGO_URL : DEV_MONGO_URL, {
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
app.use(routers);
app.use(errorLogger);
app.use(errors());
app.use(centralErrorHandler);

app.set('trust proxy', 1);
app.use(limiter);

app.listen(PORT, () => {
  // Если всё работает, консоль покажет, какой порт приложение слушает
  console.log(`App listening on port ${PORT}`);
});
