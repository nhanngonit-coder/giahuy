const { esc, money, pic } = require('../utils/helpers');

const price = p => `<strong>${money(Math.round(p.price * (100 - p.sale) / 100))}</strong>${p.sale ? `<s>${money(p.price)}</s>` : ''}`;
// Ảnh sản phẩm: p.img, hoặc public/img/products/<id>.jpg, hoặc public/img/products/<danh-mục>-<1..4>.jpg (dùng chung cho các bản v2, v3).
const thumb = p => { const im = p.img || pic('products', p.id) || pic('products', p.base); return im ? `<img src="${esc(im)}" alt="${esc(p.name)}" loading="lazy">` : p.icon; };
const card = p => `<a class="card${p.out ? ' out-of-stock' : ''}" href="/product/${p.id}"><div class="img">${thumb(p)}${p.sale ? `<span class="tag">-${p.sale}%</span>` : ''}${p.out ? '<span class="sold">Hết hàng</span>' : ''}<span class="view">Xem chi tiết</span></div>
<h3>${esc(p.name)}</h3><p>${price(p)}</p></a>`;
const track = items => `<div class="track">${items.map(card).join('')}</div>`;
const arrows = `<button type="button" aria-label="Trước" data-d="-1"><svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m15 5-7 7 7 7"/></svg></button><button type="button" aria-label="Sau" data-d="1"><svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m9 5 7 7-7 7"/></svg></button>`;

// ---------- Banner lớn (dùng cho trang chủ và các trang bộ sưu tập) ----------
// Ảnh nền tùy chọn: đặt public/img/banners/<prefix>-<số thứ tự>.jpg (vd home-1.jpg, nam-2.jpg)
const jerseys = j => j.map(c => `<svg class="jersey" viewBox="0 0 100 110"><use href="#j" fill="${c}" stroke="rgba(0,0,0,.25)"/></svg>`).join('');
const hero = (slides, prefix) => {
  const body = slides.map((s, i) => {
    const im = s.img || pic('banners', `${prefix}-${i + 1}`);
    return `<section class="slide${i ? '' : ' on'}${im ? ' photo' : ''}" style="--a:${s.c[0]};--b:${s.c[1]};--c:${s.c[2]}${im ? `;--img:url('${esc(im)}')` : ''}">
<div class="copy"><p>${s.k}</p><h2>${s.t}<span>${s.g}</span></h2><a class="cta" href="${s.b}">Xem ngay</a></div>${im ? '' : `<div class="squad">${jerseys(s.j)}</div>`}</section>`;
  }).join('');
  return `<svg width="0" height="0" style="position:absolute"><symbol id="j" viewBox="0 0 100 110"><path d="M30 8 10 20 2 48l16 6 4-14v64h56V40l4 14 16-6-8-28L70 8Q50 26 30 8Z"/></symbol></svg>
<div class="hero">${body}${slides.length > 1 ? `<div class="dots">${slides.map((_, i) => `<button class="${i ? '' : 'on'}" aria-label="Banner ${i + 1}"></button>`).join('')}</div>` : ''}</div>
<script>(()=>{const s=[...document.querySelectorAll('.slide')],d=[...document.querySelectorAll('.dots button')];if(s.length<2)return;let i=0;const go=n=>{s[i].classList.remove('on');d[i].classList.remove('on');i=(n+s.length)%s.length;s[i].classList.add('on');d[i].classList.add('on')};d.forEach((b,n)=>b.onclick=()=>go(n));if(!matchMedia('(prefers-reduced-motion:reduce)').matches)setInterval(()=>go(i+1),5500)})()</script>`;
};

module.exports = { price, thumb, card, track, arrows, hero };
