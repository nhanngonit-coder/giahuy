const firebase = require('../config/firebase');
const User = require('../models/user');
const Category = require('../models/category');

const COOKIE = 'sz_session';
const MAX_AGE = 5 * 24 * 60 * 60 * 1000; // 5 ngày (Firebase cho phép 5 phút – 14 ngày)

// Danh mục gần như không đổi, nhưng trang nào cũng cần (menu, footer) -> cache 5 phút để đỡ truy vấn DB ở xa mỗi request.
let catsCache = { at: 0, rows: null };
async function categories() {
  if (!catsCache.rows || Date.now() - catsCache.at > 5 * 60 * 1000) {
    catsCache = { at: Date.now(), rows: await Category.all() };
  }
  return catsCache.rows;
}

// Gắn req.user từ session cookie của Firebase, và req.cats cho layout.
async function loadContext(req, res, next) {
  req.user = null;
  req.cats = await categories();
  const token = req.cookies[COOKIE];
  if (token && firebase.enabled) {
    let d = null;
    try { d = await firebase.auth().verifySessionCookie(token); } catch { res.clearCookie(COOKIE); }
    // Lỗi DB ở bước này không được xóa cookie đăng nhập, nên tách khỏi try ở trên (lỗi sẽ đi vào error handler).
    if (d) {
      req.user = (await User.find(d.uid)) ||
        (await User.upsert({ uid: d.uid, name: d.name, email: d.email, avatar: d.picture, provider: d.firebase?.sign_in_provider })).user;
    }
  }
  next();
}

// Chặn trang cần đăng nhập; sau khi đăng nhập sẽ quay lại đúng trang đó.
const requireLogin = (req, res, next) => req.user ? next() : res.redirect('/login?next=' + encodeURIComponent(req.originalUrl));

// Chỉ cho vào nếu đăng nhập bằng Google và email nằm trong ADMIN_EMAILS.
// (Bắt buộc tài khoản Google vì email Google đã được xác minh; tài khoản email+mật khẩu có thể đăng ký bằng email người khác.)
const admins = () => String(process.env.ADMIN_EMAILS || '').toLowerCase().split(',').map(s => s.trim()).filter(Boolean);
const requireAdmin = (req, res, next) =>
  req.user && req.user.provider === 'google.com' && admins().includes(String(req.user.email || '').toLowerCase())
    ? next() : res.status(403).send('Bạn không có quyền truy cập trang này.');

module.exports = { COOKIE, MAX_AGE, loadContext, requireLogin, requireAdmin };