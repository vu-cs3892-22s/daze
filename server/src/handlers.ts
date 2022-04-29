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
  queryGetDiningHallsInformation,
  queryGetHistoricalData,
  queryGetHistoricalDatas
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

interface FifteenMinuteData {
  [key: string]: number;
}

interface HourlyData {
  [key: string]: number;
}

interface HistoricalData {
  name: string;
  data: FifteenMinuteData;
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

    const historicalData: HistoricalData[] | null =
      await queryGetHistoricalData(diningHallName);

    // const comments = await getDataForDiningHall(diningHallName, 1);

    const lineMode = calculateMode(lineLengths);
    const waitTime = calculateWaitTime(
      lineMode,
      throughput,
      historicalData,
      diningHallName
    );

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

    const historicalData: HistoricalData[] | null =
      await queryGetHistoricalDatas();

    const historicalDataObject: { [key: string]: HistoricalData[] } = {};

    if (historicalData) {
      for (let i = 0; i < historicalData.length; ++i) {
        historicalDataObject[historicalData[i].name] = [historicalData[i]];
      }
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

      let nameKey = '';
      if (name.includes('Rand')) {
        nameKey = 'Rand';
      } else if (name.includes('2301')) {
        nameKey = '2301';
      }

      const waitTime = calculateWaitTime(
        lineMode,
        throughput,
        nameKey !== ''
          ? historicalDataObject[nameKey]
          : historicalDataObject[name],
        name
      );

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

export const getHistoricalData = async (
  req: express.Request,
  res: express.Response
) => {
  try {
    const diningHallName = req.params.dininghall_name;
    const historicalData: HistoricalData[] | null =
      await queryGetHistoricalData(diningHallName);

    if (!historicalData) {
      return res.status(500).send({
        error: 'Failed to retrieve historical data from PostgreSQL'
      });
    } else if (historicalData.length === 0) {
      return res.status(404).send({
        error: `No historical data for ${diningHallName}`
      });
    }

    const fifteenMinuteData = historicalData[0].data;
    const hourlyData = createHourlyData(fifteenMinuteData);

    res.status(200).send({
      name: diningHallName,
      data: hourlyData
    });
  } catch (err) {
    res.status(500).send({
      error: err
    });
    console.log(err);
  }
};

export const getHistoricalDatas = async (
  req: express.Request,
  res: express.Response
) => {
  try {
    const historicalData: HistoricalData[] | null =
      await queryGetHistoricalDatas();

    if (!historicalData) {
      return res.status(500).send({
        error: 'Failed to retrieve historical data from PostgreSQL'
      });
    } else if (historicalData.length === 0) {
      return res.status(404).send({
        error: `No historical data found`
      });
    }

    const result: { [key: string]: HourlyData } = {};

    for (let i = 0; i < historicalData.length; ++i) {
      const fifteenMinuteData = historicalData[i].data;
      result[historicalData[i]['name']] = createHourlyData(fifteenMinuteData);
    }

    res.status(200).send(result);
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
    const curTime = Date.now();
    const lastTime = JSON.parse(last10[i])['timestamp'];

    let diff = (curTime - lastTime) / 1000;
    diff /= 60;

    // live submissions more than 15 minutes ago are stale
    if (Math.abs(Math.round(diff)) <= 15) {
      last10Lengths.push(JSON.parse(last10[i])['lineLength']);
    }
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

function calculateWaitTime(
  lineLength: string,
  throughput: number,
  historicalData: HistoricalData[] | null,
  diningHallName: string
) {
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
    // if we have no historical data either
    if (!historicalData || historicalData.length === 0) {
      return null;
    }

    // fall back entirely on historical data
    const centralData = new Date(
      new Date().getTime() +
      new Date().getTimezoneOffset() * 60000 +
      3600000 * -6
    );
    const hour = (centralData.getHours() + 1).toString();
    const minutes = centralData.getMinutes();

    let roundedMinutes = 0;

    if (minutes < 15) {
      roundedMinutes = 0;
    } else if (minutes < 30) {
      roundedMinutes = 15;
    } else if (minutes < 45) {
      roundedMinutes = 30;
    } else if (minutes < 60) {
      roundedMinutes = 45;
    }

    const key = hour + roundedMinutes.toString();

    // we only have historical data until 830
    if (parseInt(key) > 2030) {
      return null;
    }

    let prevKey;

    if (parseInt(key) % 100 !== 0) {
      prevKey = parseInt(key) - 15;
    } else {
      prevKey = parseInt(key) - 100 + 45;
    }

    const swipeData: HourlyData = historicalData[0].data;
    const numSwipes = swipeData[key];

    const diff = minutes - roundedMinutes;
    const rand_throughput = 9.16;
    const _2301_throughput = 1.91;

    if (diningHallName.includes('Rand')) {
      const b2 = prevKey === 645 ? 0 : swipeData[prevKey.toString()];
      const b1 = numSwipes;
      const totalRemainingPeople = b1 + b2 - rand_throughput * diff;
      return (totalRemainingPeople / 5) * throughput;
    } else if (diningHallName.includes('2301')) {
      const b2 = prevKey === 645 ? 0 : swipeData[prevKey.toString()];
      const b1 = numSwipes;
      const totalRemainingPeople = b1 + b2 - _2301_throughput * diff;
      return (totalRemainingPeople / 2) * throughput;
    }
  }

  return waitTime;
}

function createHourlyData(fifteenMinuteData: FifteenMinuteData): HourlyData {
  const hourlyData: HourlyData = {};

  let count = 0;
  let sum = 0;
  let hour = 7;
  for (const [key, value] of Object.entries(fifteenMinuteData)) {
    ++count;
    sum += value;
    if (count % 4 == 0) {
      hourlyData[hour.toString()] = sum / 4;
      hour++;
      sum = 0;
    }
  }

  // since data stops at 830
  hourlyData[hour] = sum / 2;
  return hourlyData;
}
