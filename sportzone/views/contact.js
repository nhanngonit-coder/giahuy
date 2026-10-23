const { esc } = require('../utils/helpers');
const { BANNERS } = require('../data/content');
const { page } = require('./layout');

module.exports = req => page(req, 'Liên hệ', BANNERS.contact, `<div class="head"><h2>Gửi tin nhắn cho chúng tôi</h2></div>
${req.query.ok ? '<p class="ok">Đã gửi. Chúng tôi sẽ phản hồi qua email của bạn.</p>' : ''}${req.query.err ? '<p class="err">Chưa gửi được. Kiểm tra thông tin và thử lại.</p>' : ''}
<form method="post" class="contact"><input name="name" placeholder="Họ tên" value="${esc(req.user?.name)}" required maxlength="80">
<input type="email" name="email" placeholder="Email" value="${esc(req.user?.email)}" required maxlength="120">
<textarea name="msg" rows="5" placeholder="Nội dung" required maxlength="2000"></textarea><button>Gửi tin nhắn</button></form>`);
