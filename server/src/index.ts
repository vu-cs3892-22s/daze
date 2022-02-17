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

console.log(process.env)

const port = process.env.SERVER_PORT;

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
