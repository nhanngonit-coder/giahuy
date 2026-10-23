const router = require('express').Router();
const c = require('../controllers/shop');

// Bọc hàm async để lỗi đi vào error handler của Express 4.
const w = fn => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);

router.get('/cart', w(c.cartPage));
router.get('/checkout', w(c.checkoutPage));
router.post('/api/cart', w(c.apiCart));
router.post('/api/checkout', w(c.apiCheckout));
router.get('/order/:code', w(c.successPage));

module.exports = router;
