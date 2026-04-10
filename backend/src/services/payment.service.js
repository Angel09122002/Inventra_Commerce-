const db = require('../lib/db');
const ApiError = require('../utils/ApiError');

const create = async ({ orderId, amount, paymentDate, method }) => {
  const { rows: orders } = await db.query(
    'SELECT * FROM "order" WHERE order_id = $1', [orderId]
  );
  if (!orders[0]) throw new ApiError(404, 'Order not found');

  const { rows: existing } = await db.query(
    'SELECT * FROM payment WHERE order_id = $1', [orderId]
  );
  if (existing[0]) throw new ApiError(409, 'Payment already exists for this order');

  const { rows } = await db.query(
    'INSERT INTO payment (order_id, amount, payment_date, method) VALUES ($1, $2, $3, $4) RETURNING *',
    [orderId, amount, new Date(paymentDate), method]
  );

  await db.query('UPDATE "order" SET status = $1 WHERE order_id = $2', ['PAID', orderId]);
  return rows[0];
};

const getByOrderId = async orderId => {
  const { rows } = await db.query(
    'SELECT * FROM payment WHERE order_id = $1', [orderId]
  );
  if (!rows[0]) throw new ApiError(404, 'Payment not found');
  return rows[0];
};

// New function to return all payments
const getAll = async () => {
  const { rows } = await db.query('SELECT * FROM payment ORDER BY payment_date DESC');
  return rows;
};

module.exports = { create, getByOrderId, getAll };
