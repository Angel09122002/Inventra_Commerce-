const router = require('express').Router();

router.use('/customers',  require('./customer.routes'));
router.use('/products',   require('./product.routes'));
router.use('/orders',     require('./order.routes'));
router.use('/payments',   require('./payment.routes'));
router.use('/inventory',  require('./inventory.routes'));

module.exports = router;
