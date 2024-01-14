import express from 'express';
import mongoose from 'mongoose';
import helmet from 'helmet';
import router from './routes';
import CONFIG from './config';
import mockUser from './middlewares/mockUser';
import limiter from './middlewares/limiter';

const app = express();

mongoose.connect(`mongodb://localhost:27017/${CONFIG.DBNAME}`);

app.use(helmet());
app.use(limiter);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(mockUser);

app.use(router);

app.listen(CONFIG.PORT);
