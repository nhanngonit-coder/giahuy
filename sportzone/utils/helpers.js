const fs = require('fs'), path = require('path');
const PUBLIC = path.join(__dirname, '..', 'public');

const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const money = n => n.toLocaleString('vi-VN') + '₫';
const Q = s => '/products?q=' + encodeURIComponent(s);
// Tìm ảnh trong public/img/<thư mục>/<tên>.(jpg|jpeg|png|webp); không có thì trả về undefined (dùng emoji/gradient thay thế).
const pic = (dir, name) => ['jpg', 'jpeg', 'png', 'webp'].map(e => `/img/${dir}/${name}.${e}`).find(u => fs.existsSync(path.join(PUBLIC, u)));
// Style nền cho ảnh bài viết: có ảnh thì dùng ảnh, không thì dùng gradient.
const nstyle = n => { const im = pic('blog', n.slug); return `--a:${n.c[0]};--b:${n.c[1]}${im ? `;background:url('${im}') center/cover` : ''}`; };
const isEmail = e => /^\S+@\S+\.\S+$/.test(e || '');

module.exports = { esc, money, Q, pic, nstyle, isEmail };
