import mysql from "serverless-mysql";

export const pool = mysql({
  config: {
    host: "localhost",
    user: "root",
    password: "",
    port: 3306,
    database: "nextdb",
  },
});

export async function query(q: string, values: Array<any> = []) {
  try {
    const results = await pool.query(q, values);
    await pool.end();
    return results;
  } catch (e) {
    throw Error(e.message);
  }
}
