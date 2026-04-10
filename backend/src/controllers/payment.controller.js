const asyncHandler = require('../utils/asyncHandler');
const paymentService = require('../services/payment.service');

// Existing handlers
exports.create = asyncHandler(async (req, res) => {
  const payment = await paymentService.create(req.body);
  res.status(201).json({ success: true, data: payment });
});

exports.getByOrderId = asyncHandler(async (req, res) => {
  const payment = await paymentService.getByOrderId(parseInt(req.params.orderId, 10));
  res.json({ success: true, data: payment });
});

// New handler to return all payments
exports.getAll = asyncHandler(async (req, res) => {
  const payments = await paymentService.getAll();
  res.json({ success: true, data: payments });
});
