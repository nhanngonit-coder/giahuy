const { esc, nstyle } = require('../utils/helpers');
const { POLICIES } = require('../data/content');
const { page } = require('./layout');

const renderBody = b => b.map(x => typeof x === 'string' ? `<p>${esc(x)}</p>`
  : Array.isArray(x) ? `<ul>${x.map(i => `<li>${esc(i)}</li>`).join('')}</ul>` : `<h3>${esc(x.h)}</h3>`).join('');

const policy = (req, slug) => {
  const p = POLICIES[slug];
  const side = `<aside class="side"><b>Chính sách</b>${Object.entries(POLICIES).map(([s, x]) => `<a class="${s === slug ? 'on' : ''}" href="/policy/${s}">${x.title}</a>`).join('')}</aside>`;
  return page(req, p.title, { k: 'Hướng dẫn khách hàng', t: p.title, g: 'Policy', c: ['#2b2f3a', '#0c1b2e'] },
    `<div class="crumb"><a href="/">Trang chủ</a> / <span>${p.title}</span></div>
<div class="doc">${side}<article class="prose"><h1>${p.title}</h1><p class="meta">Cập nhật: 21/10/2026</p>${renderBody(p.sec)}
<p>Cần hỗ trợ thêm? <a href="/contact">Liên hệ SportZone</a> hoặc gọi 1800 0000.</p></article></div>`);
};

const blogIndex = (req, news) => page(req, 'Blog', { k: 'Kinh nghiệm & mẹo hay', t: 'Blog', g: 'Blog', c: ['#1f5fbf', '#0c1b2e'] },
  `<div class="crumb"><a href="/">Trang chủ</a> / <span>Blog</span></div>
<div class="head"><h2>Tin tức mới nhất</h2><span>${news.length} bài viết</span></div>
<div class="news">${news.map(n => `<a class="nw" href="/blog/${n.slug}"><div class="nimg" style="${nstyle(n)}"></div><small>Đăng lúc: ${n.d}</small><h3>${esc(n.t)}</h3><p>${esc(n.s)}</p><span>Đọc tiếp</span></a>`).join('')}</div>`);

const blogPost = (req, n, more) => page(req, n.t, { k: 'Blog', t: 'Tin tức', g: 'Blog', c: n.c },
  `<div class="crumb"><a href="/">Trang chủ</a> / <a href="/blog">Blog</a> / <span>${esc(n.t)}</span></div>
<article class="prose"><div class="cover" style="${nstyle(n)}"></div><h1>${esc(n.t)}</h1><p class="meta">Đăng lúc: ${n.d}</p>${renderBody(n.body)}<a class="back" href="/blog">← Quay lại Blog</a></article>
<section class="row" style="margin-top:48px"><div class="head"><h2>BÀI VIẾT KHÁC</h2></div><div class="news">${more.map(m =>
      `<a class="nw" href="/blog/${m.slug}"><div class="nimg" style="${nstyle(m)}"></div><small>Đăng lúc: ${m.d}</small><h3>${esc(m.t)}</h3><span>Đọc tiếp</span></a>`).join('')}</div></section>`);

module.exports = { policy, blogIndex, blogPost };
