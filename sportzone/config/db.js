const fs = require('fs'), path = require('path');
const { Pool, types } = require('pg');

// COUNT(*) trả về bigint (kiểu 20) -> chuyển thành số thường thay vì chuỗi.
types.setTypeParser(20, v => parseInt(v, 10));

if (!process.env.DATABASE_URL) {
  throw new Error('Thiếu DATABASE_URL trong .env / biến môi trường.');
}

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  // Neon / Supabase / Render đều yêu cầu SSL. Chạy Postgres local thì đặt DATABASE_SSL=false.
  ssl: process.env.DATABASE_SSL === 'false' ? false : { rejectUnauthorized: false },
  // Vercel (serverless): mỗi instance chỉ nên giữ 1 kết nối.
  max: process.env.VERCEL ? 1 : 10,
});
pool.on('error', err => console.error('Lỗi kết nối Postgres:', err.message));

// Tạo bảng + nạp dữ liệu mẫu (nếu trống) đúng 1 lần cho mỗi tiến trình.
let initPromise;
const init = () => initPromise || (initPromise = (async () => {
  await pool.query(fs.readFileSync(path.join(__dirname, '..', 'db', 'schema.sql'), 'utf8'));
  const { rows } = await pool.query('SELECT COUNT(*) AS n FROM categories');
  if (!rows[0].n) {
    await require('../db/seed')(pool);
    console.log('Đã nạp dữ liệu mẫu vào PostgreSQL');
  }
})().catch(e => { initPromise = null; throw e; }));

// Dùng giống pool.query: await db.query('SELECT ... WHERE id = $1', [id])
exports.query = async (text, params) => { await init(); return pool.query(text, params); };
exports.init = init;
exports.pool = pool;
