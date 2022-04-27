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
  queryGetUserSecretKey,
  queryGetDiningHallInformation,
  queryGetDiningHallsInformation
} from './db';

interface WeeklyHours {
  Monday: number[][];
  Tuesday: number[][];
  Wednesday: number[][];
  Thursday: number[][];
  Friday: number[][];
  Saturday: number[][];
  Sunday: number[][];
}

// Structure representing hourly schedules of dining halls
// {
//   location: {
//     day: [
//       [breakfastStart, breakfastEnd],
//       [lunchStart, lunchEnd],
//       [dinnerStart, dinnerEnd]
//     ]
//     ...
//   }
//   ...
// }

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
  // First verify user
  const { email, secretKey } = req.body;
  const user = await queryGetUserSecretKey(email);
  if (!(email && secretKey && user && user.SecretKey === secretKey)) {
    res.status(401).send();
    return;
  }

  try {
    const data = req.body;
    // index 0 is the database for the data
    await insertData(data, 0);
  } catch (err) {
    console.log(err);
  }
  res.status(200).send({
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
    const lineLengths = await getDataForDiningHall(diningHallName, 0);

    const diningHallInfo: {
      name: string;
      location: string[];
      throughput: number;
      type: string;
      imageURL: string;
      schedule: WeeklyHours;
    } | null = await queryGetDiningHallInformation(diningHallName);

    if (!diningHallInfo) {
      return res.status(500).send({
        error: 'Failed to retrieve data from PostgreSQL'
      });
    }

    const throughput = diningHallInfo['throughput'];
    const longitude = diningHallInfo['location'][1];
    const latitude = diningHallInfo['location'][0];
    const image = diningHallInfo['imageURL'];
    const schedule = diningHallInfo['schedule'];

    // const comments = await getDataForDiningHall(diningHallName, 1);

    const lineMode = calculateMode(lineLengths);
    const waitTime = calculateWaitTime(lineMode, throughput);

    res.status(200).send({
      data: {
        name: diningHallName,
        lineLength: lineMode,
        waitTime: waitTime,
        longitude: longitude,
        latitude: latitude,
        image: image,
        schedule: schedule,
        timeStamp: Date.now()
      }
    });
  } catch (err) {
    res.status(500).send({
      error: err
    });
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

    const diningHallInformation:
      | {
          name: string;
          location: string[];
          throughput: number;
          type: string;
          imageURL: string;
          schedule: WeeklyHours;
        }[]
      | null = await queryGetDiningHallsInformation();

    if (!diningHallInformation) {
      return res.status(500).send({
        error: 'Failed to retrieve data from PostgreSQL'
      });
    }

    for (let i = 0; i < diningHallInformation.length; ++i) {
      const name = diningHallInformation[i]['name'];
      const latitude = diningHallInformation[i]['location'][0];
      const longitude = diningHallInformation[i]['location'][1];
      const type = diningHallInformation[i]['type'];
      const image = diningHallInformation[i]['imageURL'];
      const throughput = diningHallInformation[i]['throughput'];
      const schedule = diningHallInformation[i]['schedule'];

      const lineMode = calculateMode(data[name].lineLength);
      const waitTime = calculateWaitTime(lineMode, throughput);

      if (!name.includes('Rand')) {
        result[name] = {
          lineLength: lineMode,
          waitTime: waitTime,
          longitude: longitude,
          latitude: latitude,
          type: type,
          name: name,
          image: image,
          schedule: schedule
        };
      } else {
        rand[name] = {
          lineLength: lineMode,
          waitTime: waitTime,
          longitude: longitude,
          latitude: latitude,
          type: type,
          name: name,
          image: image,
          schedule: schedule
        };
      }
    }

    result['Rand'] = rand;

    res.status(200).send({
      data: result,
      timeStamp: Date.now()
    });
  } catch (err) {
    res.status(500).send({
      error: err
    });
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

function calculateWaitTime(lineLength: string, throughput: number) {
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
    waitTime = throughput * (shortUpperBound / 2);
  } else if (lineLength.toLowerCase() === 'm') {
    waitTime = throughput * (mediumUpperBound / 2);
  } else if (lineLength.toLowerCase() === 'l') {
    // Note: This is a lower bound, unlike the other two wait times
    waitTime = throughput * largeLowerBound;
  } else {
    // null for unknown
    return null;
  }

  return waitTime;
}
