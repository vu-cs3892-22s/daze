import express from 'express';

//import { pool } from './db';

import { queryCreateUser, 
        queryUpdateUser, 
        queryGetUser} from './db'

let test  = {
  "VanderbiltEmail": "sophia@gmail.com", 
  "FirstName": "Sop",
  "LastName": "Chen",
  "PhoneNumber": "12345"
}

export const createUser = async (req: express.Request, res: express.Response) => {
  console.log("This is the req.body: " + JSON.stringify(req.body));
  let success = await queryCreateUser(test);
  //console.log("add user returns this: " + success)

  if (success === true){
    res.status(201).send({
      message: 'Creating user: Success'
    });
  } else {
    res.status(400).send({
      message: 'Creating user: Failure'
    });
  }
};

export const updateUser = async (req: express.Request, res: express.Response) => {
  let success = await queryUpdateUser(test);

  if (success === true){
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

  let success = await queryGetUser(test.VanderbiltEmail);

  if (success === true){
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
