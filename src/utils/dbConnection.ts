import mysql from 'mysql2/promise';

const pool = mysql.createPool({
  host: '193.203.184.196',
  user: 'u286068293_Malkani',
  password: 'bAbkywW3nwv3ZER',
  database: 'u286068293_Chatdb',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

export const query = async (sql: string, params?: any[]): Promise<any> => {
  try {
    const [results] = await pool.execute(sql, params);
    return results;
  } catch (error) {
    console.error('Database query error:', error);
    throw error;
  }
};