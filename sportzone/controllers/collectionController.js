const Product = require('../models/product');
const Category = require('../models/category');
const { COLLECTIONS } = require('../data/content');
const { collection } = require('../views/catalog');
const { notFound } = require('../views/layout');

exports.show = async (req, res) => {
  const slug = req.params.slug, col = Object.hasOwn(COLLECTIONS, slug) ? COLLECTIONS[slug] : null;
  if (!col) return res.status(404).send(notFound(req, 'Không có mục này', '/', 'Về trang chủ'));
  const sections = await Promise.all(col.cats.map(async s => {
    const [cat, items] = await Promise.all([Category.find(s), Product.byCategory(s)]);
    return { cat, items: items.filter(p => !(col.skip && col.skip.test(p.name))) };
  }));
  res.send(collection(req, { col, slug, sections }));
};
