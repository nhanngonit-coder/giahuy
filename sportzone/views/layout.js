const { esc } = require('../utils/helpers');
const { MENU, POLICIES } = require('../data/content');

const IC = {
  bag: '<svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 8h14l-1 13H6zM9 8a3 3 0 016 0"/></svg>',
  search: '<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="7"/><path d="m20 20-4-4"/></svg>',
};

const menuHtml = `<ul class="menu">${MENU.map(m => `<li><a href="${m.h}">${m.t}</a>${m.g ? `<div class="mega">${m.g.map(g =>
  `<div><a class="mh" href="${g.h}">${g.t}</a>${g.i.map(i => `<a href="${i[1]}">${i[0]}</a>`).join('')}</div>`).join('')}</div>` : ''}</li>`).join('')}</ul>`;

// Ảnh đại diện: dùng ảnh của tài khoản, không có thì vẽ chữ cái đầu.
const avatarOf = u => u.avatar || 'data:image/svg+xml,' + encodeURIComponent(
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><rect width="24" height="24" fill="#e8112d"/><text x="12" y="16.5" font-size="13" font-family="Arial" font-weight="700" text-anchor="middle" fill="#fff">${esc((u.name || u.email || '?').trim()[0] || '?').toUpperCase()}</text></svg>`);

const layout = (req, title, body, full) => `<!doctype html><html lang="vi"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1"><title>${esc(title)} - SportZone</title>
<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Oswald:wght@500;600;700&family=Be+Vietnam+Pro:wght@400;600&display=swap" rel="stylesheet">
<link rel="stylesheet" href="/style.css"></head><body>
<div class="topbar"><div class="tl"><span>Hỗ trợ 24/7</span><span>Vận chuyển toàn quốc</span><span>Thanh toán tại nhà</span></div>
<div class="tr"><span>Hotline: 1800 0000</span>${req.user
    ? `<a href="/profile" title="Tài khoản của tôi"><img class="ava" src="${esc(avatarOf(req.user))}" alt=""></a><a href="/profile">Tài khoản</a><a class="out" href="/logout">Đăng xuất</a>`
    : `<a href="/login">Đăng nhập</a><a href="/register">Đăng ký</a>`}</div></div>
<header><a class="logo" href="/">SPORTZONE</a>
<nav>${menuHtml}</nav>
<form class="search" action="/products"><input name="q" placeholder="Tìm kiếm sản phẩm" aria-label="Tìm kiếm" value="${esc(req.query.q)}"><button aria-label="Tìm">${IC.search}</button></form>
<a class="bag" href="/cart" title="Giỏ hàng">${IC.bag}<i>0</i></a></header>
${full ? body : `<main>${body}</main>`}
<a class="msg" href="/contact" title="Nhắn cho chúng tôi" aria-label="Nhắn cho chúng tôi">💬</a>
<footer><div class="fcols">
<div><b>SPORTZONE</b><p>Đồ thể thao chính hãng, giao toàn quốc, thanh toán tại nhà.</p><span>Mail: info@sportzone.vn</span></div>
<div><b>Hướng dẫn</b>${Object.entries(POLICIES).map(([s, p]) => `<a href="/policy/${s}">${p.title}</a>`).join('')}</div>
<div><b>Danh mục</b>${req.cats.map(c => `<a href="/category/${c.slug}">${c.name}</a>`).join('')}</div>
<div><b>Nhận hot deal</b><form class="fsub" method="post" action="/subscribe"><input type="email" name="email" placeholder="Email của bạn" required maxlength="120" aria-label="Email"><button>Đăng ký</button></form></div>
</div><small>© 2026 SportZone</small></footer>
<script>document.querySelectorAll('.row').forEach(r=>{const ts=[...r.querySelectorAll('.tabs button')],ps=[...r.querySelectorAll('.panel')],bs=[...r.querySelectorAll('.arr button')];const tr=()=>[...r.querySelectorAll('.track')].find(x=>x.offsetParent);const upd=()=>{const t=tr();if(!t||bs.length<2)return;bs[0].disabled=t.scrollLeft<4;bs[1].disabled=t.scrollLeft+t.clientWidth>=t.scrollWidth-4};ts.forEach((b,i)=>b.onclick=()=>{ts.forEach(x=>x.classList.toggle('on',x===b));ps.forEach((p,j)=>p.hidden=j!==i);upd()});bs.forEach(b=>b.onclick=()=>{const t=tr();if(t)t.scrollBy({left:+b.dataset.d*t.clientWidth*.9,behavior:'smooth'})});r.addEventListener('scroll',upd,true);addEventListener('resize',upd);upd()})</script>
<script>try{const c=JSON.parse(localStorage.sz_cart||'[]'),i=document.querySelector('.bag i');if(i)i.textContent=c.reduce((a,x)=>a+x.q,0)}catch(e){}</script>
</body></html>`;

const banner = b => `<div class="pbanner" style="--a:${b.c[0]};--b:${b.c[1]}"><span class="ghost" aria-hidden="true">${esc(b.g || b.name)}</span><div><p>${esc(b.k)}</p><h1>${esc(b.t || b.name)}</h1></div></div>`;
const page = (req, title, b, inner) => layout(req, title, banner(b) + `<main>${inner}</main>`, true);
const notFound = (req, heading, href, label) => layout(req, 'Không tìm thấy', `<div class="head"><h2>${heading}</h2></div><p><a href="${href}">${label}</a></p>`);

module.exports = { layout, page, banner, notFound, IC, avatarOf };
