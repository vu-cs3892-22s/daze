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

pool.on('error', (err) => {
  console.error('Unexpected error on idle client', err);
});

interface CreateUserBody {
  VanderbiltEmail: String;
  FirstName: String;
  LastName: String;
  PhoneNumber: String;
}

export async function queryCreateUser(body: CreateUserBody) {
  const { VanderbiltEmail, FirstName, LastName, PhoneNumber } = body;
  const values = [VanderbiltEmail, FirstName, LastName, PhoneNumber];

  const values2 = ['lu.cao@vanderbilt.edu', 'Lu', 'Cao', '9194481535'];
  const text2 = `
  INSERT INTO users("VanderbiltEmail", "FirstName", "LastName", "PhoneNumber")
  VALUES ($1, $2, $3, $4)
  RETURNING "VanderbiltEmail"
`;

  const query = { text: text2, values: values2 };

  const text = `
    INSERT INTO users ("VanderbiltEmail", "FirstName", "LastName", "PhoneNumber")
    VALUES ('${body.VanderbiltEmail}', '${body.FirstName}', '${body.LastName}', '${body.PhoneNumber}')
    RETURNING "VanderbiltEmail"
  `;

  console.log(values);

  const client = await pool.connect();

  try {
    //await client.query(text);
    await client.query(query);

    client.release();
    return true;
  } catch (err: any) {
    console.log(err);
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
    await client.query(text);
    client.release();
    return true;
  } catch (err: any) {
    client.release();
    return false;
  }
}

export async function queryGetUser(email: String) {
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
