const router = require('express').Router();
const c = require('../controllers/adminController');
const orders = require('../controllers/orderAdminController');

const w = fn => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);

router.get('/', w(c.list));
router.get('/orders', w(orders.list));
router.get('/orders/:id', w(orders.detail));
router.post('/orders/:id/status', w(orders.status));
router.get('/products/new', w(c.newForm));
router.post('/products', w(c.create));
router.get('/products/:id/edit', w(c.editForm));
router.post('/products/:id', w(c.update));
router.post('/products/:id/delete', w(c.remove));

module.exports = router;