const asyncHandler = require("../utils/asyncHandler");
const inventoryService = require("../services/inventory.service");

exports.getAllInventory = asyncHandler(async (req, res) => {
  const data = await inventoryService.getAll();
  res.json({ success: true, data });
});

exports.getByProduct = asyncHandler(async (req, res) => {
  const data = await inventoryService.getByProduct(
    parseInt(req.params.productId, 10),
  );
  res.json({ success: true, data });
});

exports.restock = asyncHandler(async (req, res) => {
  const transaction = await inventoryService.restock({
    productId: parseInt(req.body.productId, 10),
    quantity: req.body.quantity,
  });
  res.status(201).json({ success: true, data: transaction });
});
