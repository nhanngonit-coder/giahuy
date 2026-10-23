const db = require('../config/db');
const map = r => r && { slug: r.slug, name: r.name, icon: r.icon, k: r.tagline, c: [r.c1, r.c2] };

exports.all = async () => (await db.query('SELECT * FROM categories ORDER BY sort')).rows.map(map);
exports.find = async slug => map((await db.query('SELECT * FROM categories WHERE slug = $1', [slug])).rows[0]);
