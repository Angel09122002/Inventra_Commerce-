const db = require('../lib/db');
const ApiError = require('../utils/ApiError');

const getByProduct = async (productId) => {
  const { rows: products } = await db.query(
    'SELECT * FROM product WHERE product_id = $1', [productId]
  );
  if (!products[0]) throw new ApiError(404, 'Product not found');

  const { rows: transactions } = await db.query(
    'SELECT * FROM inventory_transaction WHERE product_id = $1 ORDER BY transaction_timestamp DESC',
    [productId]
  );

  const { rows: stock } = await db.query(
    'SELECT COALESCE(SUM(quantity_change), 0) AS current_stock FROM inventory_transaction WHERE product_id = $1',
    [productId]
  );

  return {
    product: products[0],
    currentStock: parseInt(stock[0].current_stock),
    transactions,
  };
};

const restock = async ({ productId, quantity }) => {
  const { rows: products } = await db.query(
    'SELECT * FROM product WHERE product_id = $1', [productId]
  );
  if (!products[0]) throw new ApiError(404, 'Product not found');
  if (quantity <= 0) throw new ApiError(400, 'Quantity must be positive');

  const { rows } = await db.query(
    'INSERT INTO inventory_transaction (product_id, transaction_type, quantity_change) VALUES ($1, $2, $3) RETURNING *',
    [productId, 'RESTOCK', quantity]
  );
  return rows[0];
};

module.exports = { getByProduct, restock };
