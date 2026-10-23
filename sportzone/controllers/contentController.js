const News = require('../models/news');
const { POLICIES } = require('../data/content');
const { policy, blogIndex, blogPost } = require('../views/content');
const { notFound } = require('../views/layout');

exports.policy = (req, res) => {
  if (!Object.hasOwn(POLICIES, req.params.slug)) return res.status(404).send(notFound(req, 'Không tìm thấy trang', '/', 'Về trang chủ'));
  res.send(policy(req, req.params.slug));
};

exports.blogIndex = async (req, res) => res.send(blogIndex(req, await News.all()));

exports.blogPost = async (req, res) => {
  const n = await News.find(req.params.slug);
  if (!n) return res.status(404).send(notFound(req, 'Không tìm thấy trang', '/blog', 'Về trang Blog'));
  res.send(blogPost(req, n, await News.others(n.slug, 3)));
};
