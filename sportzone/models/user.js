const db = require('../config/db');

const COLS = `uid, name, email, avatar, provider,
  to_char(created_at AT TIME ZONE 'UTC', 'YYYY-MM-DD HH24:MI:SS') AS created_at`;

exports.find = async uid => (await db.query(`SELECT ${COLS} FROM users WHERE uid = $1`, [uid])).rows[0];

// Tạo mới hoặc cập nhật theo Firebase UID. Trả về { user, created }.
exports.upsert = async ({ uid, name, email, avatar, provider }) => {
  const old = await exports.find(uid);
  if (old) {
    await db.query('UPDATE users SET name = $1, email = $2, avatar = $3 WHERE uid = $4',
      [name || old.name, email || old.email, avatar || old.avatar, uid]);
  } else {
    await db.query('INSERT INTO users (uid,name,email,avatar,provider) VALUES ($1,$2,$3,$4,$5)',
      [uid, name, email, avatar, provider]);
  }
  return { user: await exports.find(uid), created: !old };
};

exports.updateName = (uid, name) => db.query('UPDATE users SET name = $1 WHERE uid = $2', [name, uid]);
