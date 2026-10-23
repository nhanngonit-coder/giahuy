const Product = require('../models/product');
const Category = require('../models/category');
const { productList } = require('../views/catalog');
const productView = require('../views/product');
const { card } = require('../views/components');
const { notFound } = require('../views/layout');

const PER_PAGE = 10;

async function list(req, res, slug) {
  const cat = slug ? await Category.find(slug) : null;
  if (slug && !cat) return res.status(404).send(notFound(req, 'Không có mục này', '/', 'Về trang chủ'));
  const q = String(req.query.q || '').toLowerCase().trim();
  const total = await Product.count({ cat: slug, q });
  const pages = Math.max(1, Math.ceil(total / PER_PAGE));
  const pg = Math.min(pages, Math.max(1, parseInt(req.query.page) || 1));
  const items = await Product.search({ cat: slug, q, limit: PER_PAGE, offset: (pg - 1) * PER_PAGE });
  res.send(productList(req, { cat, slug, q, items, total, pg, pages }));
}

exports.index = (req, res) => list(req, res, null);
exports.byCategory = (req, res) => list(req, res, req.params.slug);

exports.show = async (req, res) => {
  const p = /^\d+$/.test(req.params.id) ? await Product.find(+req.params.id) : null;
  if (!p) return res.status(404).send(notFound(req, 'Không có sản phẩm này', '/products', 'Xem tất cả sản phẩm'));
  const [c, related] = await Promise.all([Category.find(p.cat), Product.related(p, 8)]);
  res.send(productView(req, { p, c, related }));
};

// HTML các thẻ sản phẩm (dùng cho mục "Sản phẩm đã xem").
exports.cards = async (req, res) => {
  const ids = String(req.query.ids || '').split(',').slice(0, 8).map(s => /^\d+$/.test(s) ? +s : NaN);
  res.send((await Product.findMany(ids)).map(card).join(''));
};
