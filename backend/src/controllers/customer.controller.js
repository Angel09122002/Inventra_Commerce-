const asyncHandler = require('../utils/asyncHandler');
const customerService = require('../services/customer.service');

exports.getAll = asyncHandler(async (req, res) => {
  const customers = await customerService.getAll();
  res.json({ success: true, data: customers });
});

exports.getById = asyncHandler(async (req, res) => {
  const customer = await customerService.getById(parseInt(req.params.id, 10));
  res.json({ success: true, data: customer });
});

exports.create = asyncHandler(async (req, res) => {
  const customer = await customerService.create(req.body);
  res.status(201).json({ success: true, data: customer });
});

exports.update = asyncHandler(async (req, res) => {
  const customer = await customerService.update(parseInt(req.params.id, 10), req.body);
  res.json({ success: true, data: customer });
});

exports.remove = asyncHandler(async (req, res) => {
  await customerService.remove(parseInt(req.params.id, 10));
  res.json({ success: true, message: 'Customer deleted' });
});
