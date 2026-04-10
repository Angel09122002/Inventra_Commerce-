const router = require('express').Router();
const { create, getByOrderId, getAll } = require('../controllers/payment.controller');

router.post('/', create);
router.get('/', getAll); // NEW: list all payments
router.get('/order/:orderId', getByOrderId);

module.exports = router;
