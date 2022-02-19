import { Pool } from 'node-postgres';
import dotenv from 'dotenv';
import { resolve } from 'path/posix';

dotenv.config()

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
  //process.exit(-1);
})


export async function addUser(body: any){
  const text = `
    INSERT INTO users ("VanderbiltEmail", "FirstName", "LastName", "PhoneNumber")
    VALUES ('${body.VanderbiltEmail}', '${body.FirstName}', '${body.LastName}', '${body.PhoneNumber}')
    RETURNING "VanderbiltEmail"
  `;
  /*
  
  async function callQuery() {

    const client = await pool.connect()
    try {
      const res = await client.query(text)
      console.log(res.rows[0])
      resolve("0")
    } catch (err: any) {
      console.log(err.stack)
      console.log("this is the err.error_code " + err.code)
      error_code = err.error_code
      resolve(err.code)
    }
    finally {
      client.release()
    }

  }
  let value = await callQuery();
  return value; */

  pool.connect()
  .then(client => {
    return client
      .query(text)
      .then(res => {
        client.release();
        console.log(res.rows[0]);
      })
      .catch(err => {
        client.release();
        console.log(err.stack);
      })
  })  
} 

export function obtainUser(email: any){
  const text = `SELECT * FROM users WHERE VanderbiltEmail = $1`;
  const values = [email];
  
  pool.connect()
  .then(client => {
    return client
      .query(text, values)
      .then(res => {
        client.release()
        console.log(res.rows[0])
      })
      .catch(err => {
        client.release()
        console.log(err.stack)
      })
  })
}



