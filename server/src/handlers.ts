import express from 'express';
import {
  insertData,
  getDataForDiningHalls,
  getDataForDiningHall
} from './cache';
import { queryCreateUser, queryUpdateUser, queryGetUser } from './db';

export const createUser = async (
  req: express.Request,
  res: express.Response
) => {
  const queryRes = await queryCreateUser(req.body);
  console.log('hey:', queryRes);

  if (queryRes !== false) {
    res.status(201).send({
      message: queryRes
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
  // TODO: make this more semantically good (i.e. get the user's email from the request)
  const vunetId = req.params.vunet_id;

  const success = await queryGetUser(`${vunetId}@vanderbilt.edu`);
  // TODO: change VanderbiltEmail to VUNETID

  if (success !== false) {
    res.status(200).send({
      message: success
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
  console.log('blooloolooo:', req.user);
  console.log('req cookies:', req.cookies);
  console.log('req headers:', req.headers);
  // TODO: still hacky
  const loggedIn = (req.headers['set-cookie'] as [string])[0] !== 'null';
  if (!loggedIn) {
    res.status(401).send({
      message: 'Not logged in'
    });
    return;
  }
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

export const getDiningHallInfoSpecific = async (
  req: express.Request,
  res: express.Response
) => {
  const diningHallName = req.params.dininghall_name;
  try {
    const data = await getDataForDiningHall(diningHallName, 0);
    const comments = await getDataForDiningHall(diningHallName, 1);

    const lineMode = calculateMode(data);

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

export const getDiningHallInfo = async (
  req: express.Request,
  res: express.Response
) => {
  const diningHallName = req.params.dininghall_name;
  try {
    const data = await getDataForDiningHalls(0);
    const result: any = {};
    for (const key in data) {
      const lineMode = calculateMode(data[key]);
      result[key] = lineMode;
    }

    res.send({
      data: result,
      timeStamp: Date.now()
    });
  } catch (err) {
    console.log(err);
  }
};

function calculateMode(data: any) {
  const last10 = data.slice(-10);

  // if we have no data, we'll just say length is unknown
  if (last10.length === 0) {
    return 'unknown';
  }

  const last10Lengths: string[] = [];
  for (let i = 0; i < last10.length; ++i) {
    last10Lengths.push(JSON.parse(last10[i])['lineLength']);
  }

  // create object with counts
  // i.e. {"short": 2, "medium": 1, "long": 3}
  const lengthMap = last10Lengths.reduce((map: any, val: any) => {
    map[val] = (map[val] || 0) + 1;
    return map;
  }, {});

  // find the mode
  const lineMode = Object.keys(lengthMap).reduce((a, b) =>
    lengthMap[a] > lengthMap[b] ? a : b
  );

  return lineMode;
}
