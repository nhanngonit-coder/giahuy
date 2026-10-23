const { esc } = require('../utils/helpers');
const { page, avatarOf } = require('./layout');

const PROVIDERS = { 'google.com': 'Google', password: 'Email và mật khẩu' };
const date = s => { const [y, m, d] = String(s).slice(0, 10).split('-'); return `${d}/${m}/${y}`; };

module.exports = (req, { messages, ok, err }) => {
  const u = req.user;
  return page(req, 'Tài khoản của tôi', { k: 'Thông tin cá nhân', t: 'Tài khoản', g: 'Profile', c: ['#2b2f3a', '#0c1b2e'] },
    `<div class="crumb"><a href="/">Trang chủ</a> / <span>Tài khoản</span></div>
<div class="profile">
<div class="phead"><img class="pava" src="${esc(avatarOf(u))}" alt=""><div><h2>${esc(u.name || 'Chưa đặt tên')}</h2><p>${esc(u.email)}</p></div></div>
${ok ? '<p class="ok">Đã cập nhật thông tin.</p>' : ''}${err ? '<p class="err">Chưa cập nhật được. Kiểm tra tên và thử lại.</p>' : ''}
<h3>Thông tin</h3>
<form method="post" action="/profile" class="contact"><label for="pn">Họ tên</label>
<input id="pn" name="name" value="${esc(u.name)}" required maxlength="80" autocomplete="name"><button>Lưu thay đổi</button></form>
<table class="spec"><tbody>
<tr><th>Email</th><td>${esc(u.email)}</td></tr>
<tr><th>Đăng nhập bằng</th><td>${esc(PROVIDERS[u.provider] || u.provider || 'Không rõ')}</td></tr>
<tr><th>Tham gia</th><td>${esc(date(u.created_at))}</td></tr></tbody></table>
<h3>Tin nhắn đã gửi</h3>
${messages.length ? `<ul class="pmsg">${messages.map(m => `<li><small>${esc(date(m.created_at))}</small><p>${esc(m.message)}</p></li>`).join('')}</ul>`
      : '<p>Bạn chưa gửi tin nhắn nào. <a href="/contact">Liên hệ SportZone</a></p>'}
<p><a class="out" href="/logout">Đăng xuất</a></p>
</div>`);
};
