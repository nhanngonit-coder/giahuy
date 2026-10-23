const Product = require('../models/product');
const Category = require('../models/category');
const view = require('../views/admin');
const { notFound } = require('../views/layout');

const PER_PAGE = 20;
const missing = req => notFound(req, 'Không có sản phẩm này', '/admin', 'Về trang quản lý');

// Kiểm tra dữ liệu form. Trả về { v: giá trị sạch, errs: danh sách lỗi }.
function parse(b, cats) {
  const name = String(b.name || '').trim().slice(0, 120);
  const price = Number(b.price), sale = Number(b.sale || 0);
  const img = String(b.img || '').trim().slice(0, 500);
  const errs = [];
  if (!name) errs.push('Nhập tên sản phẩm.');
  if (!cats.some(c => c.slug === b.cat)) errs.push('Chọn danh mục.');
  if (!Number.isInteger(price) || price < 0 || price > 1e9) errs.push('Giá phải là số nguyên từ 0 đến 1.000.000.000.');
  if (!Number.isInteger(sale) || sale < 0 || sale > 100) errs.push('Giảm giá phải từ 0 đến 100 (%).');
  if (img && !/^(https?:\/\/|\/)/i.test(img)) errs.push('Link ảnh phải bắt đầu bằng http://, https:// hoặc /');
  return { v: { cat: b.cat, name, price, sale, img: img || null, out: b.out === '1' }, errs };
}

exports.list = async (req, res) => {
  const q = String(req.query.q || '').toLowerCase().trim();
  const total = await Product.count({ q });
  const pages = Math.max(1, Math.ceil(total / PER_PAGE));
  const pg = Math.min(pages, Math.max(1, parseInt(req.query.page) || 1));
  const items = await Product.search({ q, limit: PER_PAGE, offset: (pg - 1) * PER_PAGE });
  res.send(view.list(req, { items, total, pg, pages, q, ok: req.query.ok }));
};

exports.newForm = async (req, res) => {
  const cats = await Category.all();
  res.send(view.form(req, { p: { name: '', cat: cats[0]?.slug, price: '', sale: 0, img: '', out: false }, cats }));
};

exports.create = async (req, res) => {
  const cats = await Category.all();
  const { v, errs } = parse(req.body, cats);
  if (errs.length) return res.status(400).send(view.form(req, { p: v, cats, errs }));
  await Product.create(v);
  res.redirect('/admin?ok=1');
};

exports.editForm = async (req, res) => {
  const p = await Product.find(req.params.id);
  if (!p) return res.status(404).send(missing(req));
  res.send(view.form(req, { p, cats: await Category.all() }));
};

exports.update = async (req, res) => {
  const id = Number(req.params.id);
  if (!Number.isInteger(id)) return res.status(404).send(missing(req));
  const cats = await Category.all();
  const { v, errs } = parse(req.body, cats);
  if (errs.length) return res.status(400).send(view.form(req, { p: { ...v, id }, cats, errs }));
  if (!(await Product.update(id, v))) return res.status(404).send(missing(req));
  res.redirect('/admin?ok=2');
};

exports.remove = async (req, res) => {
  const id = Number(req.params.id);
  if (Number.isInteger(id)) await Product.remove(id);
  res.redirect('/admin?ok=3');
};