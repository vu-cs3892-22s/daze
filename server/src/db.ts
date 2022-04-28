import { Pool } from 'pg';
import dotenv from 'dotenv';

dotenv.config({
  path: `${__dirname}/../../.env`
});
const parseDBUrl = (url: string) => {
  // Heroku provides a URL with a postgres:// prefix, but node-postgres needs separate fields
  const [, , user, password, host, port, database] = url.match(
    /^(postgres:\/\/)?([^:]+):([^@]+)@([^:]+):([^/]+)\/(.+)$/
  ) as Array<string>;
  return { user, host, password, port: Number(port), database };
};

const dbConnectionDetails =
  process.env.ENV === 'production' || process.env.ENV === 'staging'
    ? parseDBUrl(process.env.DATABASE_URL || '')
    : {
        user: process.env.DB_USER,
        host: process.env.DB_HOST,
        password: process.env.DB_PASSWORD,
        port: Number(process.env.DB_PORT),
        database: process.env.DB_NAME
      };

const pool = new Pool({
  ...dbConnectionDetails,
  ssl: { rejectUnauthorized: false }
});

pool.on('error', (err) => {
  console.error('Unexpected error on idle client', err);
});

interface UserBody {
  vanderbiltEmail: string;
  secretKey: string;
}

interface WeeklyHours {
  Monday: number[][];
  Tuesday: number[][];
  Wednesday: number[][];
  Thursday: number[][];
  Friday: number[][];
  Saturday: number[][];
  Sunday: number[][];
}

interface WeeklyHours {
  Monday: number[][];
  Tuesday: number[][];
  Wednesday: number[][];
  Thursday: number[][];
  Friday: number[][];
  Saturday: number[][];
  Sunday: number[][];
}

interface HourlyData {
  '7': number;
  '8': number;
  '9': number;
  '10': number;
  '11': number;
  '12': number;
  '13': number;
  '14': number;
  '15': number;
  '16': number;
  '17': number;
  '18': number;
  '19': number;
  '20': number;
}

interface HistoricalData {
  name: string;
  data: HourlyData;
}

export async function queryCreateUser(body: UserBody) {
  const { vanderbiltEmail, secretKey } = body;

  const text = `
    INSERT INTO "Users" ("VanderbiltEmail", "SecretKey")
    VALUES ('${vanderbiltEmail}', '${secretKey}')
    RETURNING "VanderbiltEmail"
  `;

  const client = await pool.connect();

  try {
    await client.query(text);
    client.release();
    return true;
  } catch (err: unknown) {
    console.log(err);
    client.release();
    return false;
  }
}

// TODO: there really is no need for this function
export async function queryUpdateUser(body: UserBody) {
  const { vanderbiltEmail, secretKey } = body;

  const text = `
    UPDATE "Users" 
    SET "SecretKey" = '${secretKey}'
    WHERE "VanderbiltEmail" = '${vanderbiltEmail}'
  `;

  const client = await pool.connect();

  try {
    await client.query(text);
    client.release();
    return true;
  } catch (err: unknown) {
    client.release();
    return false;
  }
}

// TODO: might have to change this if we do anti-troll stuff, i.e. store a trust score
export async function queryGetUserSecretKey(email: string) {
  const text = `
    SELECT "SecretKey" 
    FROM "Users"
    WHERE "VanderbiltEmail" = '${email}'
  `;

  const client = await pool.connect();

  try {
    const result = await client.query(text);
    client.release();
    return result.rows[0];
  } catch (err: unknown) {
    console.log(err);
    client.release();
    return false;
  }
}

export async function queryGetDiningHallInformation(
  diningHallName: string
): Promise<DiningHallInformation | null> {
  const text = `
  SELECT * 
  FROM "DiningHallInformation"
  WHERE "name" = '${diningHallName}'
`;

  const client = await pool.connect();

  try {
    const result = await client.query(text);
    client.release();
    return result.rows[0];
  } catch (err: unknown) {
    console.log(err);
    client.release();
    return null;
  }
}

interface DiningHallInformation {
  name: string;
  location: string[];
  throughput: number;
  type: string;
  imageURL: string;
  schedule: WeeklyHours;
}

export async function queryGetDiningHallsInformation(): Promise<
  DiningHallInformation[] | null
> {
  const text = `
  SELECT * 
  FROM "DiningHallInformation"
`;

  const client = await pool.connect();

  try {
    const result = await client.query(text);
    client.release();
    return result.rows;
  } catch (err: unknown) {
    console.log(err);
    client.release();
    return null;
  }
}

export async function queryGetHistoricalData(
  diningHallName: string
): Promise<HistoricalData[] | null> {
  const text = `
  SELECT * 
  FROM "HistoricalData"
  WHERE "name" = '${diningHallName}'
`;

  const client = await pool.connect();

  try {
    const result = await client.query(text);
    client.release();
    return result.rows;
  } catch (err: unknown) {
    console.log(err);
    client.release();
    return null;
  }
}

export async function queryGetHistoricalDatas() {
  const text = `
  SELECT * 
  FROM "HistoricalData"
`;

  const client = await pool.connect();

  try {
    const result = await client.query(text);
    client.release();
    return result.rows;
  } catch (err: unknown) {
    console.log(err);
    client.release();
    return null;
  }
}
