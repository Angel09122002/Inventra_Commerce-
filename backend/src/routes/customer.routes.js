const router = require('express').Router();
const { getAll, getById, create, update, remove } = require('../controllers/customer.controller');

router.get('/', getAll);
router.get('/:id', getById);
router.post('/', create);
router.patch('/:id', update);
router.delete('/:id', remove);

module.exports = router;
