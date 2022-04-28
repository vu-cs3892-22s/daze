import express from 'express';
import dotenv from 'dotenv';
import {
  createUser,
  updateUser,
  // getUser,
  loginUser,
  submitData,
  submitComments,
  getDiningHall,
  getDiningHalls,
  getHistoricalData,
  getHistoricalDatas
} from './handlers';
import bodyParser from 'body-parser';
import cors from 'cors';

dotenv.config({
  path: `${__dirname}/../../.env`
});

const port = process.env.PORT; // Naming convention as per Heroku's requirements
const app = express();

app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

const prefixRoute = (route: string) => `/api/v1/${route}`;

// Users
// app.post(prefixRoute('user'), createUser);
// app.put(prefixRoute('user'), updateUser);
app.put(prefixRoute('user'), loginUser);
// app.get(prefixRoute('user/:vunet_id'), getUser);

// Data
app.post(prefixRoute('data/lines'), submitData);
app.post(prefixRoute('data/comments'), submitComments);
app.get(prefixRoute('dining_halls/:dininghall_name'), getDiningHall);
app.get(prefixRoute('dining_halls'), getDiningHalls);
app.get(prefixRoute('historical_data/:dininghall_name'), getHistoricalData);
app.get(prefixRoute('historical_data/'), getHistoricalDatas);

app.listen(port, () => {
  // eslint-disable-next-line no-console
  console.log(`App running on port ${port}.`);
});
