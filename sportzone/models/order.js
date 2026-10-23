const db = require('../config/db');

// Bảng orders đã nằm trong db/schema.sql.

exports.create = o => db.query(
  'INSERT INTO orders (code,user_uid,name,phone,address,note,items,total) VALUES ($1,$2,$3,$4,$5,$6,$7,$8)',
  [o.code, o.userUid || null, o.name, o.phone, o.address, o.note, JSON.stringify(o.items), o.total]
);

// Trang cảm ơn chỉ cần mã, món và tổng tiền (không lộ tên, SĐT, địa chỉ).
exports.byCode = async code => {
  const r = (await db.query('SELECT code, total, items FROM orders WHERE code = $1', [code])).rows[0];
  return r && { ...r, items: JSON.parse(r.items) };
};


// Quản lý đơn hàng cho quản trị viên.
exports.list = async ({status='',q='',limit=30,offset=0}={}) => {
  const filters = [], args = [];
  if (status) { args.push(status); filters.push(`status = $${args.length}`); }
  if (q) { args.push('%'+q+'%'); filters.push(`(code ILIKE $${args.length} OR name ILIKE $${args.length} OR phone ILIKE $${args.length})`); }
  const where = filters.length ? ' WHERE '+filters.join(' AND ') : '';
  const count = Number((await db.query('SELECT COUNT(*) AS n FROM orders'+where,args)).rows[0].n);
  const rows = (await db.query('SELECT id,code,name,phone,address,note,items,total,status,created_at FROM orders'+where+` ORDER BY created_at DESC LIMIT $${args.length+1} OFFSET $${args.length+2}`,[...args,limit,offset])).rows;
  return {count,rows};
};
exports.adminById = async id => (await db.query('SELECT * FROM orders WHERE id=$1',[id])).rows[0];
exports.setStatus = async (id,status) => (await db.query('UPDATE orders SET status=$1 WHERE id=$2 RETURNING id',[status,id])).rowCount > 0;
exports.stats = async () => (await db.query(`SELECT COUNT(*)::int AS total_orders, COALESCE(SUM(total),0)::bigint AS total_revenue, COUNT(*) FILTER (WHERE status='new')::int AS pending_orders FROM orders`)).rows[0];
