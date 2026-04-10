const db = require('../lib/db');
const ApiError = require('../utils/ApiError');

const create = async ({ customerId, items }) => {
  const { rows: customers } = await db.query(
    'SELECT * FROM customer WHERE customer_id = $1', [customerId]
  );
  if (!customers[0]) throw new ApiError(404, 'Customer not found');

  for (let i = 0; i < items.length; i++) {
    const item = items[i];
    const { rows: products } = await db.query(
      'SELECT * FROM product WHERE product_id = $1', [item.productId]
    );
    if (!products[0]) throw new ApiError(404, `Product ${item.productId} not found`);

    const { rows: stock } = await db.query(
      'SELECT COALESCE(SUM(quantity_change), 0) AS stock FROM inventory_transaction WHERE product_id = $1',
      [item.productId]
    );
    if (parseInt(stock[0].stock) < item.quantity) {
      throw new ApiError(400, `Not enough stock for: ${products[0].name}`);
    }
    item._product = products[0];
  }

  const { rows: orders } = await db.query(
    'INSERT INTO "order" (customer_id) VALUES ($1) RETURNING *',
    [customerId]
  );
  const order = orders[0];

  for (let i = 0; i < items.length; i++) {
    const item = items[i];
    await db.query(
      'INSERT INTO list (order_id, product_id, line_number, quantity, unit_price) VALUES ($1, $2, $3, $4, $5)',
      [order.order_id, item.productId, i + 1, item.quantity, item._product.price]
    );
    await db.query(
      'INSERT INTO inventory_transaction (product_id, order_id, transaction_type, quantity_change) VALUES ($1, $2, $3, $4)',
      [item.productId, order.order_id, 'SALE', -item.quantity]
    );
  }

  return getById(order.order_id);
};

const getAll = async () => {
  const { rows: orders } = await db.query(`
    SELECT o.*, c.first_name, c.last_name, c.email
    FROM "order" o
    JOIN customer c ON c.customer_id = o.customer_id
    ORDER BY o.order_date DESC
  `);

  for (const order of orders) {
    const { rows: items } = await db.query(`
      SELECT l.*, p.name, p.sku
      FROM list l
      JOIN product p ON p.product_id = l.product_id
      WHERE l.order_id = $1
      ORDER BY l.line_number
    `, [order.order_id]);
    order.items = items;
  }

  return orders;
};

const getById = async (id) => {
  const { rows: orders } = await db.query(`
    SELECT o.*, c.first_name, c.last_name, c.email
    FROM "order" o
    JOIN customer c ON c.customer_id = o.customer_id
    WHERE o.order_id = $1
  `, [id]);
  if (!orders[0]) throw new ApiError(404, 'Order not found');

  const { rows: items } = await db.query(`
    SELECT l.*, p.name, p.sku
    FROM list l
    JOIN product p ON p.product_id = l.product_id
    WHERE l.order_id = $1
    ORDER BY l.line_number
  `, [id]);

  const { rows: payment } = await db.query(
    'SELECT * FROM payment WHERE order_id = $1', [id]
  );

  return { ...orders[0], items, payment: payment[0] || null };
};

module.exports = { create, getAll, getById };
