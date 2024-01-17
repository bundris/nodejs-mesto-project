import express from 'express';
import mongoose from 'mongoose';
import cookieParser from 'cookie-parser';
import { errors } from 'celebrate';
import helmet from 'helmet';
import { requestLogger, errorLogger } from './middlewares/logger';
import router from './routes';
import CONFIG from './config';
import limiter from './middlewares/limiter';
import errorHandler from './middlewares/errorHandler';

const app = express();

mongoose.connect(`mongodb://localhost:27017/${CONFIG.DBNAME}`);

app.use(requestLogger);

app.use(helmet());
app.use(limiter);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use(router);

app.use(errorLogger);

app.use(errors());
app.use(errorHandler);

app.listen(CONFIG.PORT);
