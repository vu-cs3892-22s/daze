import express from 'express';
import { insertData, getDataForDiningHall } from './cache';
import { queryCreateUser, queryUpdateUser, queryGetUser } from './db';

export const createUser = async (
  req: express.Request,
  res: express.Response
) => {
  const success = await queryCreateUser(req.body);

  if (success === true) {
    res.status(201).send({
      message: 'Creating user: Success'
    });
  } else {
    res.status(400).send({
      message: 'Creating user: Failure'
    });
  }
};

export const updateUser = async (
  req: express.Request,
  res: express.Response
) => {
  const success = await queryUpdateUser(req.body);

  if (success === true) {
    res.status(201).send({
      message: 'Updating user: Success'
    });
  } else {
    res.status(400).send({
      message: 'Updating user: Failure'
    });
  }
};

export const getUser = async (req: express.Request, res: express.Response) => {
  const vunetId = req.params.vunet_id;

  const success = await queryGetUser(vunetId);
  if (success === true) {
    res.status(200).send({
      message: 'Getting user: Success'
    });
  } else {
    res.status(400).send({
      message: 'Getting user: Failure'
    });
  }
};

export const submitData = async (
  req: express.Request,
  res: express.Response
) => {
  try {
    const data = req.body;
    // index 0 is the database for the data
    await insertData(data, 0);
  } catch (err) {
    console.log(err);
  }
  res.send({
    message: 'Posting new line data'
  });
};

export const submitComments = async (
  req: express.Request,
  res: express.Response
) => {
  try {
    const data = req.body;
    // index 1 is the database for the comments
    await insertData(data, 1);
  } catch (err) {
    console.log(err);
  }
  res.send({
    message: 'Posting new comment'
  });
};

export const getDiningHallInfo = async (
  req: express.Request,
  res: express.Response
) => {
  const diningHallName = req.params.dininghall_name;
  try {
    const data = await getDataForDiningHall(diningHallName, 0);
    const comments = await getDataForDiningHall(diningHallName, 1);

    // get the 10 most recent linelengths for this dining hall
    const last10 = data.slice(-10);
    const last10Lengths = [];
    for (let i = 0; i < last10.length; ++i) {
      last10Lengths.push(JSON.parse(last10[i])["LineLength"]);
    }

    // calculate the mode
    // refine later
    const lineMode = mode(last10Lengths);

    res.send({
      data: {
        diningHallName: diningHallName,
        lineLength: lineMode,
        timeStamp: Date.now()
      }
    });
  } catch (err) {
    console.log(err);
  }
};

function mode(arr: Array<string>) {
  return arr.sort((a: string, b: string) =>
    arr.filter((v: string) => v === a).length
    - arr.filter((v: string) => v === b).length
  ).pop();
};