const Contact = require('../models/contact');
const Subscriber = require('../models/subscriber');
const { sendMail, adminMail } = require('../config/mailer');
const { isEmail } = require('../utils/helpers');
const contactView = require('../views/contact');

exports.form = (req, res) => res.send(contactView(req));

// Lưu vào DB trước (không mất tin nhắn), rồi báo về email quản trị; lỗi gửi mail chỉ ghi log.
exports.submit = async (req, res) => {
  const { name, email, msg } = req.body;
  if (!name || !msg || !isEmail(email)) return res.redirect('/contact?err=1');
  try {
    await Contact.create({ userUid: req.user?.uid, name: String(name).slice(0, 80), email: String(email).slice(0, 120), message: String(msg).slice(0, 2000) });
  } catch (e) { console.error('Lưu liên hệ lỗi:', e.message); return res.redirect('/contact?err=1'); }
  await sendMail({ to: adminMail(), replyTo: email,
    subject: 'Liên hệ từ ' + String(name).slice(0, 80).replace(/[\r\n]/g, ' '), text: `${name} <${email}>\n\n${msg}` })
    .catch(e => console.error('Gửi mail lỗi:', e.message));
  res.redirect('/contact?ok=1');
};

exports.subscribe = async (req, res) => {
  const e = String(req.body.email || '').slice(0, 120);
  if (!isEmail(e)) return res.redirect('/?sub=0');
  try { await Subscriber.add(e); } catch (x) { console.error('Lưu đăng ký lỗi:', x.message); return res.redirect('/?sub=0'); }
  await sendMail({ to: adminMail(), subject: 'Đăng ký nhận ưu đãi', text: e }).catch(x => console.error('Gửi mail lỗi:', x.message));
  res.redirect('/?sub=1');
};