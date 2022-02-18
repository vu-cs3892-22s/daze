import express from 'express';

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
