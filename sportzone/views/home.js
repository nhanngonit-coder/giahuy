const { esc, nstyle } = require('../utils/helpers');
const { SLIDES, TRIO } = require('../data/content');
const { layout } = require('./layout');
const { track, arrows, hero } = require('./components');

module.exports = (req, { newestByCat, byCat, articles, sub }) => {
  const cats = req.cats;
  const msg = { 1: 'Đã đăng ký. Cảm ơn bạn!', 0: 'Email chưa hợp lệ hoặc chưa gửi được, thử lại nhé.' }[sub] || 'Đặt hàng ngay hôm nay để nhận ƯU ĐÃI!';

  // Khối "Sản phẩm mới" có tab theo danh mục
  const newest = `<section class="row"><div class="head"><h2>SẢN PHẨM MỚI</h2><div class="arr"><a href="/products">Xem tất cả</a>${arrows}</div></div>
<div class="tabs">${cats.map((c, i) => `<button class="${i ? '' : 'on'}">${c.name}</button>`).join('')}</div>
${cats.map((c, i) => `<div class="panel"${i ? ' hidden' : ''}>${track(newestByCat[c.slug])}</div>`).join('')}</section>`;

  const rows = cats.map(c => `<section class="row"><div class="head"><h2>${c.name.toUpperCase()}</h2><div class="arr"><a href="/category/${c.slug}">Xem tất cả</a>${arrows}</div></div>
${track(byCat[c.slug])}</section>`);

  const trio = `<section class="trio">${TRIO.map(t => `<a href="${t.b}" style="--a:${t.c[0]};--b:${t.c[1]}"><small>${t.k}</small><b>${t.t}</b><span>Xem ngay</span></a>`).join('')}</section>`;
  const about = `<section class="about"><div><h2>SPORTZONE – ĐỒ THỂ THAO CHO MỌI TRẬN ĐẤU</h2>
<p>Chúng tôi chọn lọc sản phẩm thể thao chất lượng, phù hợp dáng vóc và thói quen tập luyện của người Việt: từ giày, quần áo đến vợt pickleball và trang phục đội tuyển.</p><a class="cta" href="/contact">Liên hệ</a></div><div class="aimg" aria-hidden="true">🏅</div></section>`;
  const news = `<section class="row" id="news"><div class="head"><h2>TIN TỨC MỚI NHẤT</h2><div class="arr"><a href="/blog">Xem tất cả</a></div></div><div class="news">${articles.map(n =>
    `<a class="nw" href="/blog/${n.slug}"><div class="nimg" style="${nstyle(n)}"></div><small>Đăng lúc: ${n.d}</small><h3>${esc(n.t)}</h3><span>Đọc tiếp</span></a>`).join('')}</div></section>`;

  return layout(req, 'Trang chủ', `${hero(SLIDES, 'home')}
<form class="promo" method="post" action="/subscribe"><b>${msg}</b><div><input type="email" name="email" placeholder="Nhập email" required maxlength="120" aria-label="Email"><button>Đăng ký ngay</button></div></form>
<main>${newest}${rows[0]}${rows[1]}${trio}${rows[2]}${rows[3]}${about}${news}</main>`, true);
};
