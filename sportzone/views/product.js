const { esc, pic } = require('../utils/helpers');
const { SWATCH, SIZES, SIZE_CHART, INFO, TINT } = require('../data/productInfo');
const { page } = require('./layout');
const { price, track, arrows } = require('./components');

// Dữ liệu mẫu cho phần biến thể. Có thể ghi đè từng sản phẩm bằng các trường: p.imgs (mảng ảnh), p.colors ([['Tên', '#hex'], ...]),
// p.sizes (mảng), p.desc (mảng đoạn văn), p.highlights (mảng gạch đầu dòng), p.material, p.sku.
const sku = p => p.sku || 'SZ-' + p.cat.slice(0, 2).toUpperCase() + String(p.id).padStart(4, '0');
const colorsOf = p => p.colors || Array.from({ length: 2 + (p.id % 2) }, (_, i) => SWATCH[(p.id + i * 2) % SWATCH.length]);
// Ảnh: p.imgs, hoặc public/img/products/<id>-1..6.jpg, hoặc ảnh đơn như ở thẻ sản phẩm. Không có ảnh thì dùng emoji giữ chỗ.
const slidesOf = p => {
  const first = p.img || pic('products', p.id) || pic('products', p.base);
  const extra = [1, 2, 3, 4, 5, 6].map(n => pic('products', `${p.id}-${n}`)).filter(Boolean);
  const imgs = p.imgs || (extra.length ? extra : first ? [first] : []);
  return imgs.length ? imgs.map(u => ({ html: `<img src="${esc(u)}" alt="${esc(p.name)}">`, bg: '' }))
    : TINT.map(t => ({ html: `<span>${p.icon}</span>`, bg: t }));
};
const chart = t => `<table class="spec"><thead><tr>${t.head.map(h => `<th>${h}</th>`).join('')}</tr></thead><tbody>${t.rows.map(r => `<tr>${r.map(c => `<td>${c}</td>`).join('')}</tr>`).join('')}</tbody></table>`;

module.exports = (req, { p, c, related }) => {
  const info = INFO[p.cat];
  const colors = colorsOf(p), sizes = p.sizes || SIZES[p.cat] || [], slides = slidesOf(p), multi = slides.length > 1;
  const chartKey = p.cat === 'giay' ? 'giay' : sizes.length ? 'apparel' : null;
  const off = p.out ? ' disabled' : '';

  const gallery = `<div class="gallery${multi ? '' : ' single'}">
${multi ? `<div class="thumbs">${slides.map((s, i) => `<button type="button" class="${i ? '' : 'on'}" aria-label="Xem ảnh ${i + 1}"${s.bg ? ` style="background:${s.bg}"` : ''}>${s.html}</button>`).join('')}</div>` : ''}
<div class="stage">${slides.map((s, i) => `<div class="sl${i ? '' : ' on'}"${s.bg ? ` style="background:${s.bg}"` : ''}>${s.html}</div>`).join('')}
${p.sale ? `<span class="tag">-${p.sale}%</span>` : ''}${p.out ? '<span class="sold">Hết hàng</span>' : ''}
${multi ? '<button type="button" class="go prev" data-s="-1" aria-label="Ảnh trước">‹</button><button type="button" class="go next" data-s="1" aria-label="Ảnh sau">›</button>' : ''}</div></div>`;

  const colorOpt = `<fieldset class="opt"><legend>Màu sắc: <b id="cn">${esc(colors[0][0])}</b></legend><div class="chips">${colors.map((k, i) =>
    `<label><input type="radio" name="color" value="${esc(k[0])}"${i ? '' : ' checked'}><span><i style="--c:${k[1]}"></i>${esc(k[0])}</span></label>`).join('')}</div></fieldset>`;
  const sizeOpt = sizes.length ? `<fieldset class="opt" id="szset"><legend>Kích thước: <b id="sn">Chưa chọn</b></legend><div class="chips">${sizes.map(s =>
    `<label><input type="radio" name="size" value="${esc(s)}"><span>${esc(s)}</span></label>`).join('')}</div>
<p class="err" id="szerr" role="alert" hidden>Vui lòng chọn kích thước.</p>${chartKey ? '<button type="button" class="link" id="szbtn">Hướng dẫn chọn size</button>' : ''}</fieldset>` : '';

  const specs = [['Thương hiệu', 'SPORTZONE'], ['Danh mục', c.name], ['Mã SP', sku(p)], ['Chất liệu', p.material || info.mat], ['Màu', colors.map(k => k[0]).join(', ')]].concat(sizes.length ? [['Kích thước', sizes.join(', ')]] : []);

  return page(req, p.name, c, `<div class="crumb"><a href="/">Trang chủ</a> / <a href="/category/${c.slug}">${c.name}</a> / <span>${esc(p.name)}</span></div>
<div class="detail">${gallery}
<div class="info" data-id="${p.id}" data-name="${esc(p.name)}"><h2>${esc(p.name)}</h2>
<div class="pmeta"><span>Thương hiệu: <b>SPORTZONE</b></span><span>Mã SP: <b>${sku(p)}</b></span><span class="stock ${p.out ? 'no' : 'yes'}">Tình trạng: <b>${p.out ? 'Hết hàng' : 'Còn hàng'}</b></span></div>
<p class="pr">${price(p)}${p.sale ? `<em class="off">-${p.sale}%</em>` : ''}</p>
${colorOpt}${sizeOpt}
<div class="buy"><div class="qty"><button type="button" data-q="-1" aria-label="Giảm"${off}>−</button><input id="qty" value="1" inputmode="numeric" aria-label="Số lượng"${off}><button type="button" data-q="1" aria-label="Tăng"${off}>+</button></div>
<button type="button" class="btn-add" id="add"${off}>Thêm vào giỏ</button><button type="button" class="cta" id="now"${off}>${p.out ? 'Hết hàng' : 'Mua ngay'}</button></div>
<ul class="perks"><li>Hàng chính hãng, giao toàn quốc, thanh toán tại nhà.</li><li>Xem <a href="/policy/doi-tra">chính sách đổi trả</a> và <a href="/policy/bao-hanh">bảo hành</a>.</li><li>Cần tư vấn size, màu? <a href="/contact">Nhắn cho chúng tôi</a>.</li></ul></div></div>

<section class="ptabs"><div class="bar" role="tablist"><button type="button" role="tab" class="on">Thông tin chi tiết</button><button type="button" role="tab">Thông số</button></div>
<div class="panel prose"><h3>${esc(p.name)}</h3>${(p.desc || info.desc).map(t => `<p>${esc(t)}</p>`).join('')}<h3>Đặc điểm nổi bật</h3><ul>${(p.highlights || info.hl).map(t => `<li>${esc(t)}</li>`).join('')}</ul>
<p>Mọi thông tin về đổi trả, bảo hành vui lòng xem <a href="/policy/doi-tra">Chính sách đổi trả</a> │ <a href="/policy/bao-hanh">Chính sách bảo hành</a>.</p></div>
<div class="panel" hidden><table class="spec"><tbody>${specs.map(r => `<tr><th>${r[0]}</th><td>${esc(r[1])}</td></tr>`).join('')}</tbody></table></div></section>

<section class="row"><div class="head"><h2>SẢN PHẨM BẠN QUAN TÂM</h2><div class="arr">${arrows}</div></div>${track(related)}</section>
<section class="row" id="rv" hidden><div class="head"><h2>SẢN PHẨM ĐÃ XEM</h2><div class="arr">${arrows}</div></div><div class="track"></div></section>
${chartKey ? `<dialog id="szdlg" aria-label="Bảng size"><h3>Bảng size</h3>${chart(SIZE_CHART[chartKey])}<p class="note">Số đo mang tính tham khảo. Nếu phân vân giữa hai size, nên chọn size lớn hơn.</p><button type="button" id="szclose">Đóng</button></dialog>` : ''}
<script>(()=>{
const $=s=>document.querySelector(s),$$=s=>[...document.querySelectorAll(s)],info=$('.info'),id=+info.dataset.id;
const sl=$$('.sl'),th=$$('.thumbs button');let cur=0;
const show=n=>{cur=(n+sl.length)%sl.length;sl.forEach((s,i)=>s.classList.toggle('on',i===cur));th.forEach((t,i)=>t.classList.toggle('on',i===cur))};
th.forEach((t,i)=>t.onclick=()=>show(i));$$('.stage .go').forEach(b=>b.onclick=()=>show(cur+ +b.dataset.s));
$$('input[name=color]').forEach(r=>r.onchange=()=>$('#cn').textContent=r.value);
$$('input[name=size]').forEach(r=>r.onchange=()=>{$('#sn').textContent=r.value;$('#szerr').hidden=true});
const q=$('#qty'),setQ=v=>q.value=Math.min(99,Math.max(1,parseInt(v)||1));
$$('[data-q]').forEach(b=>b.onclick=()=>setQ(+q.value+ +b.dataset.q));q.onchange=()=>setQ(q.value);
const tb=$$('.ptabs .bar button'),tp=$$('.ptabs .panel');
tb.forEach((b,i)=>b.onclick=()=>{tb.forEach(x=>x.classList.toggle('on',x===b));tp.forEach((p,j)=>p.hidden=j!==i)});
const d=$('#szdlg');if(d){$('#szbtn').onclick=()=>d.showModal();$('#szclose').onclick=()=>d.close();d.onclick=e=>{if(e.target===d)d.close()}}
const toast=m=>{const t=document.createElement('div');t.className='toast';t.setAttribute('role','status');t.textContent=m;document.body.appendChild(t);setTimeout(()=>t.remove(),2600)};
const pick=()=>{const s=$('input[name=size]:checked');if($('#szset')&&!s){$('#szerr').hidden=false;$('#szset').scrollIntoView({block:'center',behavior:'smooth'});return null}return{id:id,c:$('input[name=color]:checked').value,s:s?s.value:'',q:+q.value||1}};
const add=o=>{let c=[];try{c=JSON.parse(localStorage.sz_cart||'[]')}catch(e){}const k=c.find(x=>x.id===o.id&&x.c===o.c&&x.s===o.s);k?k.q+=o.q:c.push(o);try{localStorage.sz_cart=JSON.stringify(c)}catch(e){}$('.bag i').textContent=c.reduce((a,x)=>a+x.q,0)};
$('#add').onclick=()=>{const o=pick();if(o){add(o);toast('Đã thêm '+o.q+' sản phẩm vào giỏ')}};
$('#now').onclick=()=>{const o=pick();if(o){try{localStorage.sz_now=JSON.stringify([o])}catch(e){}location.href='/checkout?now=1'}};
let rv=[];try{rv=JSON.parse(localStorage.sz_rv||'[]')}catch(e){}
const others=rv.filter(i=>i!==id).slice(0,8);
if(others.length)fetch('/api/cards?ids='+others.join(',')).then(r=>r.text()).then(h=>{$('#rv .track').innerHTML=h;$('#rv').hidden=false;$('#rv .track').dispatchEvent(new Event('scroll'))}).catch(()=>{});
try{localStorage.sz_rv=JSON.stringify([id].concat(rv.filter(i=>i!==id)).slice(0,12))}catch(e){}
})()</script>`);
};
