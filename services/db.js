import mysql from 'mysql2/promise';
import config from '../config.js';

/* execute a query and return results */
async function query(sql, params) {
  const connection = await mysql.createConnection(config.db);
  const [results, ] = await connection.execute(sql, params);

  await connection.end();
  return results;
}

async function getBooksCount() {
  const sql = 'SELECT COUNT(id) AS total FROM books';
  const result = await query(sql);
  return Number(result[0].total);
}

/* exports */
export {
  query,
  getBooksCount,
};
