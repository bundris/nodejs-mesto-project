import express from 'express';
import mongoose from 'mongoose';
import router from './routes';
import CONFIG from './config';
import mockUser from './middlewares/mockUser';

const app = express();

mongoose.connect(`mongodb://localhost:27017/${CONFIG.DBNAME}`);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(mockUser);

app.use(router);

app.listen(CONFIG.PORT);
