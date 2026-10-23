const db = require('../config/db');
const map = r => r && { slug: r.slug, t: r.title, d: r.published, c: [r.c1, r.c2], s: r.summary, body: JSON.parse(r.body) };

exports.all = async () => (await db.query('SELECT * FROM news ORDER BY id')).rows.map(map);
exports.find = async slug => map((await db.query('SELECT * FROM news WHERE slug = $1', [slug])).rows[0]);
exports.others = async (slug, n = 3) =>
  (await db.query('SELECT * FROM news WHERE slug != $1 ORDER BY id LIMIT $2', [slug, n])).rows.map(map);
