const firebase = require('../config/firebase');
const User = require('../models/user');
const { sendMail } = require('../config/mailer');
const { esc } = require('../utils/helpers');
const { COOKIE, MAX_AGE } = require('../middleware/auth');
const view = require('../views/auth');

const ctx = () => ({ enabled: firebase.enabled, cfg: firebase.clientConfig });

exports.loginPage = (req, res) => req.user ? res.redirect('/') : res.send(view.login(req, ctx()));
exports.registerPage = (req, res) => req.user ? res.redirect('/') : res.send(view.register(req, ctx()));

// Trình duyệt gửi Firebase ID token -> server xác thực, lưu user vào DB, đổi thành session cookie.
exports.createSession = async (req, res) => {
  if (!firebase.enabled) return res.status(503).json({ error: 'Firebase chưa được cấu hình' });
  const idToken = req.body?.idToken;
  if (typeof idToken !== 'string' || !idToken) return res.status(400).json({ error: 'Thiếu idToken' });
  try {
    const auth = firebase.auth();
    const d = await auth.verifyIdToken(idToken);
    const { user, created } = await User.upsert({ uid: d.uid, name: d.name, email: d.email, avatar: d.picture, provider: d.firebase?.sign_in_provider });
    const cookie = await auth.createSessionCookie(idToken, { expiresIn: MAX_AGE });
    res.cookie(COOKIE, cookie, { maxAge: MAX_AGE, httpOnly: true, sameSite: 'lax', secure: process.env.NODE_ENV === 'production' });
    if (created && user.email) {
      await sendMail({ to: user.email, subject: 'Chào mừng đến SportZone', html: `<p>Xin chào ${esc(user.name || user.email)}, cảm ơn bạn đã đăng ký tại SportZone!</p>` })
        .catch(e => console.error('Gửi mail chào mừng lỗi:', e.message));
    }
    res.json({ ok: true });
  } catch (e) {
    console.error('Tạo session lỗi:', e.message);
    res.status(401).json({ error: 'Token không hợp lệ hoặc đã hết hạn' });
  }
};

exports.logout = (req, res) => { res.clearCookie(COOKIE); res.redirect('/'); };
