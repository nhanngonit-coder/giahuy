const { CATS, NEWS, PRODUCTS } = require('../data/seedData');

// Chèn nhiều dòng bằng 1 câu lệnh (nhanh hơn nhiều khi DB ở xa như Neon/Supabase).
async function insertMany(client, table, cols, rows) {
  if (!rows.length) return;
  const params = [];
  const values = rows.map(r => '(' + r.map(v => { params.push(v); return '$' + params.length; }).join(',') + ')');
  await client.query(
    `INSERT INTO ${table} (${cols.join(',')}) VALUES ${values.join(',')} ON CONFLICT DO NOTHING`,
    params
  );
}

module.exports = async pool => {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    await insertMany(client, 'categories', ['slug', 'name', 'icon', 'tagline', 'c1', 'c2'],
      CATS.map(c => [c.slug, c.name, c.icon, c.k, c.c[0], c.c[1]]));
    await insertMany(client, 'products', ['id', 'base', 'cat', 'name', 'price', 'sale', 'out_of_stock'],
      PRODUCTS.map(p => [p.id, p.base, p.cat, p.name, p.price, p.sale, p.out ? 1 : 0]));
    await insertMany(client, 'news', ['slug', 'title', 'published', 'summary', 'body', 'c1', 'c2'],
      NEWS.map(n => [n.slug, n.t, n.d, n.s, JSON.stringify(n.body), n.c[0], n.c[1]]));
    await client.query('COMMIT');
  } catch (e) {
    await client.query('ROLLBACK');
    throw e;
  } finally {
    client.release();
  }
};
