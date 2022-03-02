import express from 'express';
import dotenv from 'dotenv';
import {
  createUser,
  updateUser,
  getUser,
  submitData,
  submitComments,
  getDiningHallInfo
} from './handlers';
import bodyParser from 'body-parser';

dotenv.config({
  path: `.env`
});

const port = process.env.DEV_PORT || process.env.PORT; // DEV_PORT is used for local development, PORT is used for production
const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

const prefixRoute = (route: string) => `/api/v1/${route}`;

// Users
app.post(prefixRoute('user'), createUser);
app.put(prefixRoute('user'), updateUser);
app.get(prefixRoute('user/:vunet_id'), getUser);

// Data
app.post(prefixRoute('data/lines'), submitData);
app.post(prefixRoute('data/comments'), submitComments);
app.get(prefixRoute('location/:dininghall_name'), getDiningHallInfo);

app.listen(port, () => {
  // eslint-disable-next-line no-console
  console.log(`App running on port ${port}.`);
});
