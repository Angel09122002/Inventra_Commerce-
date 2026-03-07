const router = require('express').Router();
const { create, getAll, getById } = require('../controllers/order.controller');

router.get('/', getAll);
router.get('/:id', getById);
router.post('/', create);

module.exports = router;
