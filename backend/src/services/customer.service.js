const db = require('../lib/db');
const ApiError = require('../utils/ApiError');

const getAll = async () => {
  const { rows } = await db.query(
    'SELECT * FROM customer ORDER BY last_name, first_name'
  );
  return rows;
};

const getById = async (id) => {
  const { rows } = await db.query(
    'SELECT * FROM customer WHERE customer_id = $1', [id]
  );
  if (!rows[0]) throw new ApiError(404, 'Customer not found');
  return rows[0];
};

const create = async ({ firstName, lastName, email }) => {
  const { rows } = await db.query(
    'INSERT INTO customer (first_name, last_name, email) VALUES ($1, $2, $3) RETURNING *',
    [firstName, lastName, email]
  );
  return rows[0];
};

const update = async (id, { firstName, lastName, email }) => {
  const { rows } = await db.query(`
    UPDATE customer
    SET first_name = COALESCE($1, first_name),
        last_name  = COALESCE($2, last_name),
        email      = COALESCE($3, email)
    WHERE customer_id = $4
    RETURNING *
  `, [firstName, lastName, email, id]);
  if (!rows[0]) throw new ApiError(404, 'Customer not found');
  return rows[0];
};

const remove = async (id) => {
  const { rows } = await db.query(
    'DELETE FROM customer WHERE customer_id = $1 RETURNING *', [id]
  );
  if (!rows[0]) throw new ApiError(404, 'Customer not found');
};

module.exports = { getAll, getById, create, update, remove };
