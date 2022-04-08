import { Pool } from 'node-postgres';
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
  } catch (err: unknown) {
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
  } catch (err: unknown) {
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
  } catch (err: unknown) {
    client.release();
    return false;
  }
}
