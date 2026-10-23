const { page } = require('./layout');

const BANNER = t => ({ k: 'Tài khoản SportZone', t, g: 'Account', c: ['#2b2f3a', '#0c1b2e'] });
// JSON nhúng trong <script>: chặn "<" để không thể thoát khỏi thẻ.
const json = o => JSON.stringify(o).replace(/</g, '\\u003c');

const shell = (req, { title, enabled, cfg, form, alt }) => page(req, title, BANNER(title), `<div class="auth">
${enabled ? '' : '<p class="err">Chưa cấu hình Firebase. Điền FIREBASE_* trong .env rồi khởi động lại server.</p>'}
<p id="authmsg" role="alert" hidden></p>
${form}
<div class="or"><span>hoặc</span></div>
<button type="button" class="gbtn" id="gbtn"><svg viewBox="0 0 48 48" width="18" height="18" aria-hidden="true"><path fill="#EA4335" d="M24 9.5c3.5 0 6.6 1.2 9.1 3.6l6.8-6.8C35.8 2.4 30.3 0 24 0 14.6 0 6.5 5.4 2.6 13.2l7.9 6.1C12.4 13.6 17.7 9.5 24 9.5z"/><path fill="#4285F4" d="M46.5 24.5c0-1.6-.1-3.1-.4-4.5H24v9h12.7c-.6 3-2.3 5.5-4.8 7.2l7.5 5.8c4.4-4.1 7.1-10.1 7.1-17.5z"/><path fill="#FBBC05" d="M10.5 28.7A14.5 14.5 0 0 1 9.5 24c0-1.6.3-3.2.8-4.7l-7.9-6.1A24 24 0 0 0 0 24c0 3.9.9 7.5 2.6 10.8l7.9-6.1z"/><path fill="#34A853" d="M24 48c6.5 0 11.9-2.1 15.9-5.8l-7.5-5.8c-2.1 1.4-4.9 2.3-8.4 2.3-6.3 0-11.6-4.1-13.5-9.8l-7.9 6.1C6.5 42.6 14.6 48 24 48z"/></svg>Tiếp tục với Google</button>
<p class="alt">${alt}</p></div>
<script id="fbcfg" type="application/json">${json(cfg)}</script>
<script type="module" src="/js/auth.js"></script>`);

exports.login = (req, o) => shell(req, { ...o, title: 'Đăng nhập',
  form: `<form class="contact" id="f-login">
<input type="email" name="email" placeholder="Email" required maxlength="120" autocomplete="email" aria-label="Email">
<input type="password" name="password" placeholder="Mật khẩu" required minlength="6" maxlength="128" autocomplete="current-password" aria-label="Mật khẩu">
<button>Đăng nhập</button></form>`,
  alt: '<a href="#" id="forgot">Quên mật khẩu?</a> · Chưa có tài khoản? <a href="/register">Đăng ký</a>' });

exports.register = (req, o) => shell(req, { ...o, title: 'Đăng ký',
  form: `<form class="contact" id="f-reg">
<input name="name" placeholder="Họ tên" required maxlength="80" autocomplete="name" aria-label="Họ tên">
<input type="email" name="email" placeholder="Email" required maxlength="120" autocomplete="email" aria-label="Email">
<input type="password" name="password" placeholder="Mật khẩu (ít nhất 6 ký tự)" required minlength="6" maxlength="128" autocomplete="new-password" aria-label="Mật khẩu">
<button>Tạo tài khoản</button></form>`,
  alt: 'Đã có tài khoản? <a href="/login">Đăng nhập</a>' });
