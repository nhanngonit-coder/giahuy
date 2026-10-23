const Product = require('../models/product');
const News = require('../models/news');
const view = require('../views/home');

exports.index = async (req, res) => {
  const newestByCat = {}, byCat = {};
  // Chạy song song các truy vấn để trang chủ không phải chờ từng câu một (DB ở xa nên mỗi câu tốn thời gian).
  const [articles] = await Promise.all([
    News.all(),
    ...req.cats.map(async c => {
      [newestByCat[c.slug], byCat[c.slug]] = await Promise.all([
        Product.byCategory(c.slug, { inStock: true, limit: 8 }),
        Product.byCategory(c.slug),
      ]);
    }),
  ]);
  res.send(view(req, { newestByCat, byCat, articles, sub: req.query.sub }));
};
