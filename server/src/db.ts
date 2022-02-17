import { Pool, Client, QueryArrayConfig } from 'node-postgres';
import dotenv from 'dotenv';

dotenv.config()

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: Number(process.env.DB_PORT)
});

// TODO: Export db functions here
pool.query('SELECT NOW()', (err, res) => {
  console.log(err, res)
  pool.end()
})

const client = new Client({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: Number(process.env.DB_PORT)
});
client.connect()

client.query('SELECT NOW()', (err, res) => {
  console.log(err, res)
  client.end()
})

export function addUser(body: any){
  
  const text = `
    INSERT INTO users (VanderbiltEmail, FirstName, LastName, PhoneNumber)
    VALUES ($1, $2, $3, $4)
    RETURNING VanderbiltEmail
  `;

  const values = [body.VanderbiltEmail, body.FirstName, body.LastName, body.PhoneNumber]

  pool.query(text, values, (error: any, results: any) => {
    if (error) {
      return error
    }
    return results;
  }) 
}



