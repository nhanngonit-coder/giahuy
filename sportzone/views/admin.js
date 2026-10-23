const { esc, money } = require('../utils/helpers');
const { page } = require('./layout');
const { thumb } = require('./components');

const BANNER = { k: 'Khu vực quản trị', t: 'Quản lý sản phẩm', g: 'Admin', c: ['#2b2f3a', '#0c1b2e'] };
const CSS = `<style>
.adm{overflow-x:auto}
.adm table{width:100%;border-collapse:collapse;font-size:14px}
.adm th,.adm td{padding:10px 8px;border-bottom:1px solid #e5e5e5;text-align:left;vertical-align:middle}
.adm .th{width:56px;height:56px;display:flex;align-items:center;justify-content:center;background:#f4f4f5;border-radius:8px;overflow:hidden;font-size:26px}
.adm .th img{width:100%;height:100%;object-fit:cover}
.adm .acts{display:flex;gap:8px;white-space:nowrap}
.adm .acts form{margin:0}
.adm .acts a,.adm .acts button{padding:6px 12px;border:1px solid #ccc;border-radius:6px;background:#fff;cursor:pointer;font:inherit;color:inherit;text-decoration:none}
.adm .acts .del{color:#e8112d;border-color:#e8112d}
.adm .bar{display:flex;gap:12px;flex-wrap:wrap;align-items:center;margin:16px 0}
.adm .bar form{display:flex;gap:8px;margin:0}
.adm .bar input{padding:8px 10px;border:1px solid #ccc;border-radius:6px}
.afrm{max-width:560px;display:grid;gap:12px}
.afrm label{font-weight:600;display:grid;gap:6px}
.afrm input:not([type=checkbox]),.afrm select{padding:10px;border:1px solid #ccc;border-radius:6px;font:inherit}
.afrm .chk{display:flex;align-items:center;gap:8px;font-weight:400}
</style>`;
const MSG = { 1: 'Đã thêm sản phẩm.', 2: 'Đã lưu thay đổi.', 3: 'Đã xóa sản phẩm.' };

exports.list = (req, { items, total, pg, pages, q, ok }) => {
  const base = '/admin?' + (q ? 'q=' + encodeURIComponent(q) + '&amp;' : '') + 'page=';
  const rows = items.map(p => `<tr>
<td><div class="th">${thumb(p)}</div></td>
<td>${esc(p.name)}<br><small>#${p.id}</small></td>
<td>${esc(p.cat)}</td>
<td>${money(p.price)}</td>
<td>${p.sale ? '-' + p.sale + '%' : ''}</td>
<td>${p.out ? 'Hết hàng' : 'Còn hàng'}</td>
<td><div class="acts"><a href="/admin/products/${p.id}/edit">Sửa</a>
<form method="post" action="/admin/products/${p.id}/delete" onsubmit="return confirm('Xóa sản phẩm này?')"><button class="del">Xóa</button></form></div></td></tr>`).join('');
  return page(req, 'Quản lý sản phẩm', BANNER, `${CSS}<div class="crumb"><a href="/">Trang chủ</a> / <span>Quản lý sản phẩm</span></div>
${MSG[ok] ? `<p class="ok">${MSG[ok]}</p>` : ''}
<div class="adm"><p><a class="cta" href="/admin/orders">Quản lý đơn hàng →</a></p><div class="bar"><a class="cta" href="/admin/products/new">+ Thêm sản phẩm</a>
<form action="/admin"><input name="q" value="${esc(q)}" placeholder="Tìm theo tên" aria-label="Tìm"><button class="ghostbtn">Tìm</button></form>
<span>${total} sản phẩm</span></div>
<table><thead><tr><th>Ảnh</th><th>Tên</th><th>Danh mục</th><th>Giá</th><th>Giảm</th><th>Tình trạng</th><th></th></tr></thead>
<tbody>${rows || '<tr><td colspan="7">Không có sản phẩm.</td></tr>'}</tbody></table></div>
<div class="pager">${pg > 1 ? `<a href="${base}${pg - 1}">Trước</a>` : ''}<span>Trang ${pg}/${pages}</span>${pg < pages ? `<a href="${base}${pg + 1}">Sau</a>` : ''}</div>`);
};

exports.form = (req, { p, cats, errs = [] }) => {
  const isNew = !p.id;
  return page(req, isNew ? 'Thêm sản phẩm' : 'Sửa sản phẩm', BANNER, `${CSS}<div class="crumb"><a href="/admin">Quản lý sản phẩm</a> / <span>${isNew ? 'Thêm mới' : 'Sửa #' + p.id}</span></div>
${errs.length ? `<p class="err" role="alert">${errs.map(esc).join('<br>')}</p>` : ''}
<form class="afrm" method="post" action="${isNew ? '/admin/products' : '/admin/products/' + p.id}">
<label>Tên sản phẩm<input name="name" value="${esc(p.name)}" required maxlength="120"></label>
<label>Danh mục<select name="cat">${cats.map(c => `<option value="${esc(c.slug)}"${c.slug === p.cat ? ' selected' : ''}>${esc(c.name)}</option>`).join('')}</select></label>
<label>Giá (VNĐ)<input name="price" type="number" min="0" step="1" value="${esc(p.price)}" required></label>
<label>Giảm giá (%)<input name="sale" type="number" min="0" max="100" value="${esc(p.sale)}"></label>
<label>Link ảnh (không bắt buộc)<input name="img" value="${esc(p.img)}" maxlength="500" placeholder="https://... hoặc /img/products/ten-anh.jpg"></label>
<label class="chk"><input type="checkbox" name="out" value="1"${p.out ? ' checked' : ''}> Hết hàng</label>
<div><button class="cta">${isNew ? 'Thêm sản phẩm' : 'Lưu thay đổi'}</button> <a class="ghostbtn" href="/admin">Hủy</a></div></form>`);
};