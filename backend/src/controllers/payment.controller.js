const asyncHandler = require('../utils/asyncHandler');
const paymentService = require('../services/payment.service');

exports.create = asyncHandler(async (req, res) => {
  const payment = await paymentService.create(req.body);
  res.status(201).json({ success: true, data: payment });
});

exports.getByOrderId = asyncHandler(async (req, res) => {
  const payment = await paymentService.getByOrderId(parseInt(req.params.orderId, 10));
  res.json({ success: true, data: payment });
});
