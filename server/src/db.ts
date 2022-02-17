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

console.log(process.env.DB_NAME)
console.log(process.env.DB_USER)
console.log(process.env.DB_HOST)
console.log(process.env.DB_PORT)

pool.on('error', (err, client) => {
  console.error('Unexpected error on idle client', err)
  process.exit(-1)
})


export function addUser(body: any){
  
  const text = `
    INSERT INTO users (VanderbiltEmail, FirstName, LastName, PhoneNumber)
    VALUES ($1, $2, $3, $4)
    RETURNING VanderbiltEmail
  `;

  const values = [body.VanderbiltEmail, body.FirstName, body.LastName, body.PhoneNumber]
/*
  pool.query(text, values) 

  */
  pool.connect((err, client, done) => {
    if (err) throw err
    client.query(text, values , (err, res) => {
      done()
      if (err) {
        console.log(err.stack)
      } else {
        console.log(res.rows[0])
      }
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



