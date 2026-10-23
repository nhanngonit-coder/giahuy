const db = require('../config/db');

exports.add = email =>
  db.query('INSERT INTO subscribers (email) VALUES ($1) ON CONFLICT (email) DO NOTHING', [email.toLowerCase()]);
