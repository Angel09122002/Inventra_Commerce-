const asyncHandler = require('../utils/asyncHandler');
const orderService = require('../services/order.service');

exports.create = asyncHandler(async (req, res) => {
  const order = await orderService.create(req.body);
  res.status(201).json({ success: true, data: order });
});

exports.getAll = asyncHandler(async (req, res) => {
  const orders = await orderService.getAll();
  res.json({ success: true, data: orders });
});

exports.getById = asyncHandler(async (req, res) => {
  const order = await orderService.getById(parseInt(req.params.id, 10));
  res.json({ success: true, data: order });
});
