import dotenv from 'dotenv';
import pkg from 'pg';
const { Pool } = pkg;

dotenv.config();

// Set up PostgreSQL client
const pool = new Pool({
  host: process.env.PG_HOST,
  user: process.env.PG_USER,
  password: process.env.PG_PASSWORD,
  database: process.env.PG_DATABASE,
  port: process.env.PG_PORT,
});

const connectAndSetupDB = async () => {
  const client = await pool.connect();
  try {
    const createTableQuery = `
      CREATE TABLE IF NOT EXISTS todos (
          id SERIAL PRIMARY KEY,
          task VARCHAR(255) NOT NULL,
          completed BOOLEAN DEFAULT FALSE
      );
    `;
    await client.query(createTableQuery);
    console.log("Connected to Postgres");
  } catch (error) {
    console.log(error);
  } finally {
    client.release();
  }
}

export { pool, connectAndSetupDB }