const router = require('express').Router();
const { create, getByOrderId } = require('../controllers/payment.controller');

router.post('/', create);
router.get('/order/:orderId', getByOrderId);

module.exports = router;
