const router = require('express').Router();
const { getByProduct, restock } = require('../controllers/inventory.controller');

router.get('/:productId', getByProduct);
router.post('/restock', restock);

module.exports = router;
