import express from 'express';
import {
  insertData,
  getDataForDiningHalls,
  getDataForDiningHall
} from './cache';
import {
  queryCreateUser,
  queryUpdateUser,
  // queryGetUser,
  queryGetUserSecretKey
} from './db';

export const loginUser = async (
  req: express.Request,
  res: express.Response
) => {
  const { email, secretKey } = req.body;

  // First, check if user exists.
  const user = await queryGetUserSecretKey(email);
  if (user) {
    // User exists, check if secret key matches.
    if (user.SecretKey === secretKey) {
      // Secret key matches, login user.
      console.log('Successfully logged in user.');
      res.send({
        success: true,
        message: 'User logged in.'
      });
    } else {
      // Secret key does not match, return error.
      res.send({
        success: false,
        message: 'Secret key does not match.'
      });
    }
  } else if (
    await queryCreateUser({
      vanderbiltEmail: email,
      secretKey
    })
  ) {
    res.send({
      success: true,
      message: 'User created.'
    });
  } else {
    res.send({
      success: false,
      message: 'User could not be created.'
    });
  }
};

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

// export const getUser = async (req: express.Request, res: express.Response) => {
//   const vunetId = req.params.vunet_id;

//   const success = await queryGetUser(vunetId);
//   if (success === true) {
//     res.status(200).send({
//       message: 'Getting user: Success'
//     });
//   } else {
//     res.status(400).send({
//       message: 'Getting user: Failure'
//     });
//   }
// };

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

export const getDiningHall = async (
  req: express.Request,
  res: express.Response
) => {
  const diningHallName = req.params.dininghall_name;
  try {
    const data = await getDataForDiningHall(diningHallName, 0);
    const comments = await getDataForDiningHall(diningHallName, 1);

    const lineMode = calculateMode(data);
    const waitTime = calculateWaitTime(diningHallName, lineMode);

    res.send({
      data: {
        diningHallName: diningHallName,
        lineLength: lineMode,
        waitTime: waitTime,
        timeStamp: Date.now()
      }
    });
  } catch (err) {
    console.log(err);
  }
};

export const getDiningHalls = async (
  req: express.Request,
  res: express.Response
) => {
  try {
    const data = await getDataForDiningHalls(0);
    const result: any = {};
    const rand: any = {};

    for (const key in data) {
      const lineMode = calculateMode(data[key].lineLength);
      const waitTime = calculateWaitTime(key, lineMode);

      if (!key.includes('Rand')) {
        result[key] = {
          lineLength: lineMode,
          waitTime: waitTime,
          longitude: data[key].longitude,
          latitude: data[key].latitude
        };
      } else {
        rand[key] = {
          lineLength: lineMode,
          waitTime: waitTime,
          longitude: data[key].longitude,
          latitude: data[key].latitude
        };
      }
    }

    result['Rand'] = rand;

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

function calculateWaitTime(diningHallName: string, lineLength: string) {
  const diningHallThroughputs: { [key: string]: number } = {
    '2301': 1,
    Commons: 2,
    EBI: 3,
    Kissam: 4,
    McTyeire: 5,
    Rand_Bowls: 6,
    Rand_Randwich: 7,
    Rand_Fresh_Mex: 8,
    Rand_Mongolian: 9,
    Rand_Chicken_Shack: 10,
    Zeppos: 11,
    Alumni: 12,
    Grins: 13,
    Holy_Smokes: 14,
    Local_Java: 15,
    Suzies_Blair: 16,
    Suzies_FGH: 17,
    Suzies_MRB: 18,
    Food_For_Thought: 19
  };

  let waitTime = 0;

  /**
   * short - 5 or less
   * medium - 6 to 12
   * long - more than 12
   */

  const shortUpperBound = 5;
  const mediumUpperBound = 12;
  const largeLowerBound = 13;

  if (lineLength.toLowerCase() === 's') {
    // take the median of the range
    waitTime = diningHallThroughputs[diningHallName] * (shortUpperBound / 2);
  } else if (lineLength.toLowerCase() === 'm') {
    waitTime = diningHallThroughputs[diningHallName] * (mediumUpperBound / 2);
  } else if (lineLength.toLowerCase() === 'l') {
    // Note: This is a lower bound, unlike the other two wait times
    waitTime = diningHallThroughputs[diningHallName] * largeLowerBound;
  } else {
    // null for unknown
    return null;
  }

  return waitTime;
}
