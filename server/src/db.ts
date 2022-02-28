import { Pool } from 'node-postgres';
import dotenv from 'dotenv';

dotenv.config();

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: Number(process.env.DB_PORT),
  ssl: { rejectUnauthorized: false }
});

pool.on('error', (err, client) => {
  console.error('Unexpected error on idle client', err);
});

export async function queryCreateUser(body: any) {
  const text = `
    INSERT INTO users ("VanderbiltEmail", "FirstName", "LastName", "PhoneNumber")
    VALUES ('${body.VanderbiltEmail}', '${body.FirstName}', '${body.LastName}', '${body.PhoneNumber}')
    RETURNING "VanderbiltEmail"
  `;

  const client = await pool.connect();

  try {
    const res = await client.query(text);

    client.release();
    return true;
  } catch (err: any) {
    client.release();

    return false;
  }
}

export async function queryUpdateUser(body: any) {
  const text = `
    UPDATE users 
    SET "FirstName" = '${body.FirstName}', "LastName" = '${body.LastName}', "PhoneNumber" = '${body.PhoneNumber}'
    WHERE "VanderbiltEmail" = '${body.VanderbiltEmail}'
  `;

  const client = await pool.connect();

  try {
    const res = await client.query(text);
    client.release();
    return true;
  } catch (err: any) {
    client.release();
    return false;
  }
}

export async function queryGetUser(email: any) {
  const text = `
    SELECT * 
    FROM users
    WHERE "VanderbiltEmail" = '${email}'
  `;

  const client = await pool.connect();

  try {
    const res = await client.query(text);
    client.release();
    return true;
  } catch (err: any) {
    client.release();
    return false;
  }
}