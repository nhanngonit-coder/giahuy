const { BANNERS } = require('../data/content');
const { layout, page } = require('./layout');
const { card, track, arrows, hero } = require('./components');

// Danh sách sản phẩm có phân trang (/products, /category/:slug)
const productList = (req, { cat, slug, q, items, total, pg, pages }) => {
  const base = (slug ? '/category/' + slug : '/products') + '?' + (q ? 'q=' + encodeURIComponent(q) + '&amp;' : '') + 'page=';
  const nums = Array.from({ length: pages }, (_, i) => `<a class="${i + 1 === pg ? 'on' : ''}" href="${base}${i + 1}">${i + 1}</a>`).join('');
  return page(req, cat ? cat.name : 'Tất cả sản phẩm', cat || BANNERS.products, `<div class="crumb"><a href="/">Trang chủ</a> / <span>${cat ? cat.name : 'Tất cả sản phẩm'}</span></div>
<div class="head"><h2>${cat ? cat.name : 'Tất cả sản phẩm'}</h2><span>${total} sản phẩm</span></div>
<div class="grid">${items.map(card).join('') || '<p>Không tìm thấy sản phẩm. Thử từ khóa khác.</p>'}</div>
<div class="pager">${pg > 1 ? `<a href="${base}${pg - 1}">Trước</a>` : ''}${nums}${pg < pages ? `<a href="${base}${pg + 1}">Sau</a>` : ''}</div>`);
};

// Trang bộ sưu tập (Đồ nam / Đồ nữ / Môn thể thao)
const collection = (req, { col, slug, sections }) => {
  const rows = sections.map(({ cat, items }) => {
    return `<section class="row"><div class="head"><h2>${cat.name.toUpperCase()}</h2><div class="arr"><a href="/category/${cat.slug}">Xem tất cả</a>${arrows}</div></div>${track(items)}</section>`;
  }).join('');
  return layout(req, col.name, `${hero(col.slides, slug)}<main>${rows}</main>`, true);
};

module.exports = { productList, collection };
