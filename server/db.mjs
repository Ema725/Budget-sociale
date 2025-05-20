import sqlite from 'sqlite3';

export const db = new sqlite.Database('DATABASE.db', (err) => {
  if (err) throw err;
});