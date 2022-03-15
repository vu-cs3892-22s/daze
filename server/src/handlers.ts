import express from 'express';

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

export const submitData = (req: express.Request, res: express.Response) => {
  // Insert DB function
  res.send({
    message: 'Posting new line data'
  });
};

export const submitComments = (req: express.Request, res: express.Response) => {
  // Insert DB function
  res.send({
    message: 'Posting new comment'
  });
};

export const getDiningHallInfo = (
  req: express.Request,
  res: express.Response
) => {
  const diningHallName = req.params.dininghall_name;
  // Insert DB function
  res.send({
    message: `Getting info for ${diningHallName}`
  });
};
