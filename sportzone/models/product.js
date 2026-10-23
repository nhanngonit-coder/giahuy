const db = require('../config/db');

const SELECT = `SELECT p.id, p.base, p.cat, p.name, p.price, p.sale, p.out_of_stock, p.img, c.icon
  FROM products p JOIN categories c ON c.slug = p.cat`;
const map = r => r && { id: r.id, base: r.base, cat: r.cat, name: r.name, price: r.price, sale: r.sale, out: !!r.out_of_stock, img: r.img || undefined, icon: r.icon };

function where({ cat, q } = {}) {
  const w = [], a = [];
  if (cat) { a.push(cat); w.push(`p.cat = $${a.length}`); }
  if (q) {
    a.push('%' + q.toLowerCase().replace(/[\\%_]/g, '\\$&') + '%');
    w.push(`lower(p.name) LIKE $${a.length}`);
  }
  return { sql: w.length ? ' WHERE ' + w.join(' AND ') : '', args: a };
}

exports.find = async id => {
  const n = Number(id);
  if (!Number.isInteger(n)) return undefined;
  return map((await db.query(SELECT + ' WHERE p.id = $1', [n])).rows[0]);
};

// Giữ đúng thứ tự ids, bỏ id không tồn tại.
exports.findMany = async ids => {
  ids = ids.filter(Number.isInteger);
  if (!ids.length) return [];
  const rows = (await db.query(SELECT + ' WHERE p.id = ANY($1::int[])', [ids])).rows.map(map);
  return ids.map(i => rows.find(p => p.id === i)).filter(Boolean);
};

exports.byCategory = async (cat, { inStock = false, limit = null } = {}) =>
  (await db.query(
    SELECT + ` WHERE p.cat = $1${inStock ? ' AND p.out_of_stock = 0' : ''} ORDER BY p.id LIMIT $2`,
    [cat, limit < 0 ? null : limit]
  )).rows.map(map);

exports.search = async ({ cat, q, limit, offset }) => {
  const { sql, args } = where({ cat, q });
  const n = args.length;
  return (await db.query(
    SELECT + sql + ` ORDER BY p.id LIMIT $${n + 1} OFFSET $${n + 2}`,
    [...args, limit, offset]
  )).rows.map(map);
};

exports.count = async ({ cat, q } = {}) => {
  const { sql, args } = where({ cat, q });
  return (await db.query('SELECT COUNT(*) AS n FROM products p' + sql, args)).rows[0].n;
};

// Cùng danh mục trước, rồi tới danh mục khác.
exports.related = async (p, n = 8) =>
  (await db.query(SELECT + ' WHERE p.id != $1 ORDER BY (p.cat = $2) DESC, p.id LIMIT $3', [p.id, p.cat, n])).rows.map(map);

// ---- Quản trị ----
// v = { cat, name, price, sale, out, img }
exports.create = async v => (await db.query(
  `INSERT INTO products (id, cat, name, price, sale, out_of_stock, img)
   VALUES ((SELECT COALESCE(MAX(id), 0) + 1 FROM products), $1, $2, $3, $4, $5, $6) RETURNING id`,
  [v.cat, v.name, v.price, v.sale, v.out ? 1 : 0, v.img])).rows[0].id;

exports.update = async (id, v) => (await db.query(
  'UPDATE products SET cat = $1, name = $2, price = $3, sale = $4, out_of_stock = $5, img = $6 WHERE id = $7',
  [v.cat, v.name, v.price, v.sale, v.out ? 1 : 0, v.img, id])).rowCount;

exports.remove = async id => (await db.query('DELETE FROM products WHERE id = $1', [id])).rowCount;