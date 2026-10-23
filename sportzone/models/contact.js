const db = require('../config/db');

exports.create = ({ userUid, name, email, message }) =>
  db.query('INSERT INTO contacts (user_uid,name,email,message) VALUES ($1,$2,$3,$4)', [userUid || null, name, email, message]);

// created_at giữ nguyên định dạng chuỗi 'YYYY-MM-DD HH:MM:SS' (UTC) như bản SQLite.
exports.byUser = async (uid, n = 10) => (await db.query(
  `SELECT message, to_char(created_at AT TIME ZONE 'UTC', 'YYYY-MM-DD HH24:MI:SS') AS created_at
   FROM contacts WHERE user_uid = $1 ORDER BY id DESC LIMIT $2`, [uid, n])).rows;
