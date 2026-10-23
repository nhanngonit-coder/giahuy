const router = require('express').Router();
const home = require('../controllers/homeController');
const product = require('../controllers/productController');
const collection = require('../controllers/collectionController');
const content = require('../controllers/contentController');
const contact = require('../controllers/contactController');
const auth = require('../controllers/authController');
const profile = require('../controllers/profileController');
const { requireLogin, requireAdmin } = require('../middleware/auth');

// Express 4 không tự bắt lỗi của hàm async: bọc lại để lỗi đi vào error handler thay vì làm request treo.
const w = fn => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);

router.get('/', w(home.index));

router.get('/products', w(product.index));
router.get('/category/:slug', w(product.byCategory));
router.get('/product/:id', w(product.show));
router.get('/api/cards', w(product.cards));
router.get('/collection/:slug', w(collection.show));

router.get('/blog', w(content.blogIndex));
router.get('/blog/:slug', w(content.blogPost));
router.get('/policy/:slug', w(content.policy));

router.get('/contact', w(contact.form));
router.post('/contact', w(contact.submit));
router.post('/subscribe', w(contact.subscribe));

router.get('/login', w(auth.loginPage));
router.get('/register', w(auth.registerPage));
router.post('/auth/session', w(auth.createSession));
router.get('/logout', w(auth.logout));

router.get('/profile', requireLogin, w(profile.show));
router.post('/profile', requireLogin, w(profile.update));
router.use('/admin', requireLogin, requireAdmin, require('./admin'));
module.exports = router;
