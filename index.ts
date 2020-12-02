import express from 'express';
import errorHandler from 'errorhandler';
import config from './config'
import router from './routes';
import { hello } from './controller';

const PORT: number = parseInt(<string>process.env.PORT, 10) || config.PORT;

const app = express();
app.use(errorHandler());

app.get('/hello',hello);

app.listen(PORT,config.HOSTNAME);
console.log(`Listening at ${config.HOSTNAME}:${config.PORT}`);