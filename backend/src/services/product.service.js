const db = require('../lib/db');
const ApiError = require('../utils/ApiError');

const getAll = async () => {
  const { rows } = await db.query(`
    SELECT p.*, COALESCE(SUM(it.quantity_change), 0) AS current_stock
    FROM product p
    LEFT JOIN inventory_transaction it ON it.product_id = p.product_id
    GROUP BY p.product_id
    ORDER BY p.name
  `);
  return rows;
};

const getById = async (id) => {
  const { rows } = await db.query(`
    SELECT p.*, COALESCE(SUM(it.quantity_change), 0) AS current_stock
    FROM product p
    LEFT JOIN inventory_transaction it ON it.product_id = p.product_id
    WHERE p.product_id = $1
    GROUP BY p.product_id
  `, [id]);
  if (!rows[0]) throw new ApiError(404, 'Product not found');
  return rows[0];
};

const create = async ({ name, sku, price }) => {
  const { rows } = await db.query(
    'INSERT INTO product (name, sku, price) VALUES ($1, $2, $3) RETURNING *',
    [name, sku, price]
  );
  return rows[0];
};

const update = async (id, { name, sku, price }) => {
  const { rows } = await db.query(`
    UPDATE product
    SET name  = COALESCE($1, name),
        sku   = COALESCE($2, sku),
        price = COALESCE($3, price)
    WHERE product_id = $4
    RETURNING *
  `, [name, sku, price, id]);
  if (!rows[0]) throw new ApiError(404, 'Product not found');
  return rows[0];
};

const remove = async (id) => {
  const { rows } = await db.query(
    'DELETE FROM product WHERE product_id = $1 RETURNING *',
    [id]
  );
  if (!rows[0]) throw new ApiError(404, 'Product not found');
};

module.exports = { getAll, getById, create, update, remove };
