import express from 'express';

//import { pool } from './db';

import { addUser } from './db'


export const createUser = (req: express.Request, res: express.Response) => {

  let test  = {
    "VanderbiltEmail": "sophia.s.chen@vanderbilt.edu", 
    "FirstName": "Sophia",
    "LastName": "Chen",
    "PhoneNumber": "12345"
  }
  addUser(test);

  /*
  // Insert DB function
  const text = `
    INSERT INTO users (VanderbiltEmail, FirstName, LastName, PhoneNumber)
    VALUES ($1, $2, $3, $4)
    RETURNING VanderbiltEmail
  `;

  const values = [req.body.VanderbiltEmail, req.body.FirstName, req.body.LastName, req.body.PhoneNumber]

  pool.query(text, values, (error: any, results: any) => {
    if (error) {
      throw error
    }
    res.status(201).send(`User created with email: ${results.VanderbiltEmail}`)
  })

  */
  
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
