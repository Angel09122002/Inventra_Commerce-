const asyncHandler = require('../utils/asyncHandler');
const productService = require('../services/product.service');

exports.getAll = asyncHandler(async (req, res) => {
  const products = await productService.getAll();
  res.json({ success: true, data: products });
});

exports.getById = asyncHandler(async (req, res) => {
  const product = await productService.getById(parseInt(req.params.id, 10));
  res.json({ success: true, data: product });
});

exports.create = asyncHandler(async (req, res) => {
  const product = await productService.create(req.body);
  res.status(201).json({ success: true, data: product });
});

exports.update = asyncHandler(async (req, res) => {
  const product = await productService.update(parseInt(req.params.id, 10), req.body);
  res.json({ success: true, data: product });
});

exports.remove = asyncHandler(async (req, res) => {
  await productService.remove(parseInt(req.params.id, 10));
  res.json({ success: true, message: 'Product deleted' });
});
