const { esc, money } = require('../utils/helpers');
const { page } = require('./layout');
const { thumb } = require('./components');

const BANNER = (t, g) => ({ k: 'Mua sắm tại SportZone', t, g, c: ['#e8112d', '#7a0a1a'] });
const opts = l => [l.c, l.s && 'Size ' + l.s].filter(Boolean).map(esc).join(' · ');
const crumb = last => `<div class="crumb"><a href="/">Trang chủ</a> / ${last}</div>`;

const line = l => `<div class="cl${l.p.out ? ' out-of-stock' : ''}" data-i="${l.idx}">
<a class="cimg" href="/product/${l.p.id}">${thumb(l.p)}</a>
<div class="ci"><a href="/product/${l.p.id}">${esc(l.p.name)}</a><small>${opts(l)}</small><small>${money(l.unit)}${l.p.out ? ' · <b class="err">Hết hàng</b>' : ''}</small></div>
<div class="qty"><button type="button" data-a="-1" aria-label="Giảm">−</button><input value="${l.q}" inputmode="numeric" aria-label="Số lượng"><button type="button" data-a="1" aria-label="Tăng">+</button></div>
<strong class="csum">${money(l.sum)}</strong>
<button type="button" class="crm" data-a="rm" aria-label="Xóa ${esc(l.p.name)}">Xóa</button></div>`;

// Khối giỏ hàng (server dựng lại sau mỗi lần đổi số lượng / xóa)
const cartBox = (lines, total) => {
  const blocked = lines.some(l => l.p.out);
  return `<div class="clist">${lines.map(line).join('')}</div>
<div class="cfoot"><p>Tổng cộng: <strong>${money(total)}</strong></p>${blocked ? '<p class="err">Có sản phẩm hết hàng, vui lòng xóa khỏi giỏ để thanh toán.</p>' : ''}
<div class="cbtns"><a class="ghostbtn" href="/products">Tiếp tục mua</a>${blocked ? '<span class="cta off">Thanh toán</span>' : '<a class="cta" href="/checkout">Thanh toán</a>'}</div></div>`;
};

// Tóm tắt đơn ở trang thanh toán
const mini = (lines, total) => `<ul class="cmini">${lines.filter(l => !l.p.out).map(l =>
  `<li><span>${esc(l.p.name)}${opts(l) ? ` <small>(${opts(l)})</small>` : ''} × ${l.q}</span><b>${money(l.sum)}</b></li>`).join('')}</ul>
<p class="cmtotal">Tổng: <strong>${money(total)}</strong></p>`;

const cart = req => page(req, 'Giỏ hàng', BANNER('Giỏ hàng', 'Cart'), `${crumb('<span>Giỏ hàng</span>')}
<div id="cart" aria-live="polite"><p>Đang tải giỏ hàng…</p></div>
<script>(()=>{
const box=document.getElementById('cart');
const load=()=>{try{return JSON.parse(localStorage.sz_cart||'[]')}catch(e){return[]}};
const save=c=>{try{localStorage.sz_cart=JSON.stringify(c)}catch(e){}const i=document.querySelector('.bag i');if(i)i.textContent=c.reduce((a,x)=>a+(+x.q||0),0)};
let cart=load();
const draw=()=>{
  if(!cart.length){box.innerHTML='<p>Giỏ hàng đang trống.</p><a class="cta" href="/products">Tiếp tục mua sắm</a>';return}
  fetch('/api/cart',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({items:cart})}).then(r=>r.json()).then(d=>{
    if(d.keep.length!==cart.length){cart=d.keep.map(i=>cart[i]);save(cart);return draw()}
    box.innerHTML=d.html;
  }).catch(()=>{box.innerHTML='<p class="err">Không tải được giỏ hàng. Vui lòng tải lại trang.</p>'});
};
box.addEventListener('click',e=>{
  const b=e.target.closest('[data-a]'),row=e.target.closest('.cl');if(!b||!row)return;
  const i=+row.dataset.i,a=b.dataset.a;
  if(a==='rm')cart.splice(i,1);else cart[i].q=Math.min(99,Math.max(1,(+cart[i].q||1)+ +a));
  save(cart);draw();
});
box.addEventListener('change',e=>{
  const row=e.target.closest('.cl');if(!row||e.target.tagName!=='INPUT')return;
  cart[+row.dataset.i].q=Math.min(99,Math.max(1,parseInt(e.target.value)||1));save(cart);draw();
});
draw();
})()</script>`);

const checkout = req => page(req, 'Thanh toán', BANNER('Thanh toán', 'Checkout'), `${crumb('<a href="/cart">Giỏ hàng</a> / <span>Thanh toán</span>')}
<div class="ckout">
<form class="contact" id="cf" novalidate>
<p class="err" id="cerr" role="alert" hidden></p>
<input name="name" placeholder="Họ tên" value="${esc(req.user?.name)}" required maxlength="80" autocomplete="name" aria-label="Họ tên">
<input name="phone" type="tel" placeholder="Số điện thoại" required maxlength="15" autocomplete="tel" aria-label="Số điện thoại">
<input name="address" placeholder="Địa chỉ nhận hàng" required maxlength="200" autocomplete="street-address" aria-label="Địa chỉ nhận hàng">
<textarea name="note" rows="3" placeholder="Ghi chú (không bắt buộc)" maxlength="300" aria-label="Ghi chú"></textarea>
<button id="cgo">Đặt hàng (thanh toán khi nhận hàng)</button></form>
<aside class="cside"><h3>Đơn hàng của bạn</h3><div id="cmini"><p>Đang tải…</p></div></aside></div>
<script>(()=>{
const now=new URLSearchParams(location.search).has('now'),key=now?'sz_now':'sz_cart';
let items=[];try{items=JSON.parse(localStorage[key]||'[]')}catch(e){}
const f=document.getElementById('cf'),err=document.getElementById('cerr'),mini=document.getElementById('cmini'),go=document.getElementById('cgo');
const post=(u,b)=>fetch(u,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(b)});
if(!items.length){mini.innerHTML='<p>Chưa có sản phẩm. <a href="/products">Chọn sản phẩm</a></p>';go.disabled=true}
else post('/api/cart',{items:items}).then(r=>r.json()).then(d=>{mini.innerHTML=d.mini}).catch(()=>{mini.textContent='Không tải được đơn hàng.'});
f.onsubmit=e=>{
  e.preventDefault();err.hidden=true;go.disabled=true;
  const b=Object.fromEntries(new FormData(f));b.items=items;
  post('/api/checkout',b).then(r=>r.json().then(d=>({ok:r.ok,d:d}))).then(({ok,d})=>{
    if(!ok){err.textContent=d.error||'Chưa đặt được hàng, thử lại nhé.';err.hidden=false;go.disabled=false;return}
    try{localStorage.removeItem(key)}catch(x){}
    location.href='/order/'+d.code;
  }).catch(()=>{err.textContent='Lỗi kết nối, vui lòng thử lại.';err.hidden=false;go.disabled=false});
};
})()</script>`);

const success = (req, o) => page(req, 'Đặt hàng thành công', BANNER('Đặt hàng thành công', 'Thank you'), `${crumb('<span>Đặt hàng thành công</span>')}
<div class="done"><h2>Cảm ơn bạn đã đặt hàng!</h2>
<p>Mã đơn của bạn: <b>#${esc(o.code)}</b>. Chúng tôi sẽ gọi điện xác nhận và giao hàng sớm nhất.</p>
<ul class="cmini">${o.items.map(i => `<li><span>${esc(i.name)} × ${i.q}</span><b>${money(i.unit * i.q)}</b></li>`).join('')}</ul>
<p class="cmtotal">Tổng: <strong>${money(o.total)}</strong> (thanh toán khi nhận hàng)</p>
<a class="cta" href="/">Về trang chủ</a></div>`);

module.exports = { cart, cartBox, mini, checkout, success };