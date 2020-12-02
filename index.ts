import express from 'express';
import errorHandler from 'errorhandler';
import config from './config'
import router from './routes';
import { hello } from './controller';
require('dotenv').config();

const PORT: number = process.env.DEPLOY === "local" ? config.PORT : parseInt(<string>process.env.PORT, 10);
const HOSTNAME = process.env.DEPLOY === "local" ? config.HOSTNAME : "food-game.herokuapp.com";

const app = express();
app.use(errorHandler());

app.get('/hello',hello);

app.listen(process.env.PORT);
console.log(`Listening at ${config.HOSTNAME}:${config.PORT}`);