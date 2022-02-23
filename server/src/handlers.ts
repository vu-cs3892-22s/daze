import express from 'express';
import { insertData, getDataForDiningHall } from './cache';

export const createUser = (req: express.Request, res: express.Response) => {
  // Insert DB function
  res.send({
    message: 'Creating new user'
  });
};

export const updateUser = (req: express.Request, res: express.Response) => {
  // Insert DB function
  res.send({
    message: 'Updating user'
  });
};

export const getUser = (req: express.Request, res: express.Response) => {
  const vunetId = req.params.vunet_id;
  // Insert DB function
  res.send({
    message: `Getting user ${vunetId}`
  });
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

    // TODO: Figure out calculation for line length
    res.send({
      data: data,
      comments: comments
    });
  } catch (err) {
    console.log(err);
  }
};
