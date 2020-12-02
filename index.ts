import express from 'express';
import errorHandler from 'errorhandler';
import config from './config'
import router from './routes';
import { hello } from './controller';

const app = express();
app.use(errorHandler());

app.get('/hello',hello);

app.listen(config.PORT,config.HOSTNAME);
console.log(`Listening at ${config.HOSTNAME}:${config.PORT}`);