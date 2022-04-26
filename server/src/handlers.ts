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

const _2301Hours = {
  Monday: [
    [7, 10],
    [11, 15],
    [16.5, 20]
  ],
  Tuesday: [
    [7, 10],
    [11, 15],
    [16.5, 20]
  ],
  Wednesday: [
    [7, 10],
    [11, 15],
    [16.5, 20]
  ],
  Thursday: [
    [7, 10],
    [11, 15],
    [16.5, 20]
  ],
  Friday: [[7, 10], [11, 15], []],
  Saturday: [[], [], []],
  Sunday: [[], [], [16.5, 20]]
};

const randHours = {
  Monday: [[7, 11], [11, 15], []],
  Tuesday: [[7, 11], [11, 15], []],
  Wednesday: [[7, 11], [11, 15], []],
  Thursday: [[7, 11], [11, 15], []],
  Friday: [[7, 11], [11, 15], []],
  Saturday: [[], [], []],
  Sunday: [[], [], []]
};

const suziesHours = {
  Monday: [[8, 11], [11, 14.5], []],
  Tuesday: [[8, 11], [11, 14.5], []],
  Wednesday: [[8, 11], [11, 14.5], []],
  Thursday: [[8, 11], [11, 14.5], []],
  Friday: [[8, 11], [11, 14.5], []],
  Saturday: [[], [], []],
  Sunday: [[], [], []]
};

const commonsKissamHours = {
  Monday: [
    [7, 10],
    [11, 14.5],
    [16.5, 20]
  ],
  Tuesday: [
    [7, 10],
    [11, 14.5],
    [16.5, 20]
  ],
  Wednesday: [
    [7, 10],
    [11, 14.5],
    [16.5, 20]
  ],
  Thursday: [
    [7, 10],
    [11, 14.5],
    [16.5, 20]
  ],
  Friday: [
    [7, 10],
    [11, 14.5],
    [16.5, 20]
  ],
  Saturday: [
    [9, 11],
    [11, 14],
    [16.5, 20]
  ],
  Sunday: [
    [9, 11],
    [11, 14],
    [16.5, 20]
  ]
};

const ebiZepposHours = {
  Monday: [
    [7, 10.5],
    [11, 14.5],
    [16.5, 19.5]
  ],
  Tuesday: [
    [7, 10.5],
    [11, 14.5],
    [16.5, 19.5]
  ],
  Wednesday: [
    [7, 10.5],
    [11, 14.5],
    [16.5, 19.5]
  ],
  Thursday: [
    [7, 10.5],
    [11, 14.5],
    [16.5, 19.5]
  ],
  Friday: [
    [7, 10.5],
    [11, 14.5],
    [16.5, 19.5]
  ],
  Saturday: [
    [9, 11],
    [11, 14],
    [16.5, 19.5]
  ],
  Sunday: [
    [9, 11],
    [11, 14],
    [16.5, 19.5]
  ]
};

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

const diningHallSchedules: { [key: string]: WeeklyHours } = {
  '2301_Bowls': _2301Hours,
  '2301_Smoothies': _2301Hours,
  Commons: commonsKissamHours,
  EBI: ebiZepposHours,
  Kissam: commonsKissamHours,
  McTyeire: {
    Monday: [[], [], [17.75, 19]],
    Tuesday: [[], [], [17.75, 19]],
    Wednesday: [[], [], [17.75, 19]],
    Thursday: [[], [], [17.75, 19]],
    Friday: [[], [], []],
    Saturday: [[], [], []],
    Sunday: [[], [], []]
  },
  Rand_Bowls: randHours,
  Rand_Randwich: randHours,
  Rand_Fresh_Mex: randHours,
  Rand_Mongolian: randHours,
  Rand_Chicken_Shack: randHours,
  Zeppos: ebiZepposHours,
  Alumni: {
    Monday: [[], [11, 14], [14, 16]],
    Tuesday: [[], [11, 14], [14, 16]],
    Wednesday: [[], [11, 14], [14, 16]],
    Thursday: [[], [11, 14], [14, 16]],
    Friday: [[], [11, 14], [14, 16]],
    Saturday: [[], [], []],
    Sunday: [[], [], []]
  },
  Grins: {
    Monday: [
      [7, 11],
      [11, 14],
      [14, 18.5]
    ],
    Tuesday: [
      [7, 11],
      [11, 14],
      [14, 18.5]
    ],
    Wednesday: [
      [7, 11],
      [11, 14],
      [14, 18.5]
    ],
    Thursday: [
      [7, 11],
      [11, 14],
      [14, 18.5]
    ],
    Friday: [[7, 11], [11, 14], []],
    Saturday: [[], [], []],
    Sunday: [[], [], []]
  },
  Holy_Smokes: {
    Monday: [[], [12, 13.5], [17, 19.5]],
    Tuesday: [[], [12, 13.5], [17, 19.5]],
    Wednesday: [[], [12, 13.5], [17, 19.5]],
    Thursday: [[], [12, 13.5], [17, 19.5]],
    Friday: [[], [], []],
    Saturday: [[], [], []],
    Sunday: [[], [12, 14], []]
  },
  Local_Java: {
    Monday: [[7, 10], [10, 13.5], []],
    Tuesday: [[7, 10], [10, 13.5], []],
    Wednesday: [[7, 10], [10, 13.5], []],
    Thursday: [[7, 10], [10, 13.5], []],
    Friday: [[7, 10], [10, 13.5], []],
    Saturday: [[], [], []],
    Sunday: [[], [], []]
  },
  Suzies_Blair: suziesHours,
  Suzies_FGH: suziesHours,
  Suzies_MRB: {
    Monday: [[7.5, 12.5], [12.5, 16.5], []],
    Tuesday: [[7.5, 12.5], [12.5, 16.5], []],
    Wednesday: [[7.5, 12.5], [12.5, 16.5], []],
    Thursday: [[7.5, 12.5], [12.5, 16.5], []],
    Friday: [[7.5, 12.5], [12.5, 16.5], []],
    Saturday: [[], [], []],
    Sunday: [[], [], []]
  },
  Food_For_Thought: {
    Monday: [
      [8, 12],
      [12, 15],
      [15, 20]
    ],
    Tuesday: [
      [8, 12],
      [12, 15],
      [15, 20]
    ],
    Wednesday: [
      [8, 12],
      [12, 15],
      [15, 20]
    ],
    Thursday: [
      [8, 12],
      [12, 15],
      [15, 20]
    ],
    Friday: [[8, 12], [12, 15], []],
    Saturday: [[], [], []],
    Sunday: [[], [], []]
  }
};

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
        schedule: diningHallSchedules[diningHallName],
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
          schedule: diningHallSchedules[name]
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
          schedule: diningHallSchedules[name]
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
