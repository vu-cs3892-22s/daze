import express from 'express';

//import { pool } from './db';

import { addUser, obtainUser } from './db'

let test  = {
  "VanderbiltEmail": "sophia@gmail.com", 
  "FirstName": "Sophia",
  "LastName": "Chen",
  "PhoneNumber": "12345"
}

export const createUser = (req: express.Request, res: express.Response) => {
  console.log("This is the req.body: " + JSON.stringify(req.body))
  let error_code = addUser(test)
  console.log("add user returns this: " + error_code)

  /*
  if (error_code === 0){
      res.status(200).send({
        message: 'Creating user succesfully'
      });
  } else if (error_code === 23505){
    res.status(400).send({
      message: 'Duplicate email'
    });
  } else {
    res.status(400).send('Bad request')
  };*/

  res.send({
    message: 'Creating user'
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

  obtainUser(vunetId);
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
