import { Pool } from 'node-postgres';
import dotenv from 'dotenv';

dotenv.config({
  path: `${__dirname}/../../.env`
});

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: Number(process.env.DB_PORT),
  ssl: { rejectUnauthorized: false }
});

pool.on('error', (err) => {
  console.error('Unexpected error on idle client', err);
});

interface UserBody {
  vanderbiltEmail: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
}

export async function queryCreateUser(body: UserBody) {
  const { vanderbiltEmail, firstName, lastName, phoneNumber } = body;

  const text = `
    INSERT INTO users ("VanderbiltEmail", "FirstName", "LastName", "PhoneNumber")
    VALUES ('${vanderbiltEmail}', '${firstName}', '${lastName}', '${phoneNumber}')
    RETURNING "VanderbiltEmail"
  `;

  const client = await pool.connect();

  try {
    await client.query(text);

    client.release();
    return true;
  } catch (err: any) {
    console.log(err);
    client.release();

    return false;
  }
}

export async function queryUpdateUser(body: UserBody) {
  const { vanderbiltEmail, firstName, lastName, phoneNumber } = body;

  const text = `
    UPDATE users 
    SET "FirstName" = '${firstName}', "LastName" = '${lastName}', "PhoneNumber" = '${phoneNumber}'
    WHERE "VanderbiltEmail" = '${vanderbiltEmail}'
  `;

  const client = await pool.connect();

  try {
    await client.query(text);
    client.release();
    return true;
  } catch (err: any) {
    client.release();
    return false;
  }
}

export async function queryGetUser(email: string) {
  const text = `
    SELECT * 
    FROM users
    WHERE "VanderbiltEmail" = '${email}'
  `;

  const client = await pool.connect();

  try {
    await client.query(text);
    client.release();
    return true;
  } catch (err: any) {
    client.release();
    return false;
  }
}
