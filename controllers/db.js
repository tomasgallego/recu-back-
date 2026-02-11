import pkg from "pg";
const { Pool } = pkg;

export const pool = new Pool({
  connectionString: "psql 'postgresql://neondb_owner:npg_MQyE5zmPY8bC@ep-proud-hat-aionuaeb-pooler.c-4.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require'",
  ssl: {
    rejectUnauthorized: false
  }
});


  export const dbController = {
    pool: pool,
};

export const query = async (text, params = []) => {
   const client = await dbController.pool.connect();
  try {
    const result = await client.query(text, params);
    return result;
  } finally {
    client.release();
  }
};

