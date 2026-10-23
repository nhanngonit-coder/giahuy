require('dotenv').config();
const path = require('path');
const express = require('express');
const cookieParser = require('cookie-parser');
const { loadContext } = require('./middleware/auth');
const { notFound } = require('./views/layout');
const routes = require('./routes');

const app = express();
app.disable('x-powered-by');
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: false }));
app.use(express.json({ limit: '20kb' }));
app.use(cookieParser());
app.use((req, res, next) => loadContext(req, res, next).catch(next));
app.use(require('./routes/shop'));
app.use(routes);

app.use((req, res) => res.status(404).send(notFound(req, 'Không tìm thấy trang', '/', 'Về trang chủ')));
app.use((err, req, res, next) => { // eslint-disable-line no-unused-vars
  if (err.status && err.status < 500) return res.status(err.status).send('Yêu cầu không hợp lệ');
  console.error(err);
  res.status(500).send('Lỗi máy chủ');
});

module.exports = app;
