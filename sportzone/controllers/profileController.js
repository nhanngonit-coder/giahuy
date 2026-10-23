const firebase = require('../config/firebase');
const User = require('../models/user');
const Contact = require('../models/contact');
const view = require('../views/profile');

exports.show = async (req, res) =>
  res.send(view(req, { messages: await Contact.byUser(req.user.uid), ok: req.query.ok, err: req.query.err }));

// Đổi tên hiển thị: cập nhật Firebase trước (để lần đăng nhập sau không ghi đè lại tên cũ), rồi tới DB.
exports.update = async (req, res) => {
  const name = String(req.body.name || '').replace(/\s+/g, ' ').trim().slice(0, 80);
  if (!name) return res.redirect('/profile?err=1');
  try {
    if (firebase.enabled) await firebase.auth().updateUser(req.user.uid, { displayName: name });
    await User.updateName(req.user.uid, name);
    res.redirect('/profile?ok=1');
  } catch (e) {
    console.error('Cập nhật hồ sơ lỗi:', e.message);
    res.redirect('/profile?err=1');
  }
};
