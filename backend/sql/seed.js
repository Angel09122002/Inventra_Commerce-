require('dotenv').config();
const { Pool } = require('pg');

const pool = new Pool({ connectionString: process.env.DATABASE_URL });

async function main() {
  console.log('Seeding database...');

  // Customers
  const { rows: [jane] } = await pool.query(
    'INSERT INTO customer (first_name, last_name, email) VALUES ($1, $2, $3) RETURNING *',
    ['Jane', 'Doe', 'jane@example.com']
  );
  await pool.query(
    'INSERT INTO customer (first_name, last_name, email) VALUES ($1, $2, $3)',
    ['John', 'Smith', 'john@example.com']
  );

  // Products
  const { rows: [laptop] } = await pool.query(
    'INSERT INTO product (name, sku, price) VALUES ($1, $2, $3) RETURNING *',
    ['Laptop', 'LAP-001', 999.99]
  );
  const { rows: [mouse] } = await pool.query(
    'INSERT INTO product (name, sku, price) VALUES ($1, $2, $3) RETURNING *',
    ['Wireless Mouse', 'MOU-001', 29.99]
  );
  const { rows: [keyboard] } = await pool.query(
    'INSERT INTO product (name, sku, price) VALUES ($1, $2, $3) RETURNING *',
    ['Mechanical Keyboard', 'KEY-001', 79.99]
  );

  // Restock inventory
  await pool.query(
    'INSERT INTO inventory_transaction (product_id, transaction_type, quantity_change) VALUES ($1, $2, $3), ($4, $5, $6), ($7, $8, $9)',
    [laptop.product_id, 'RESTOCK', 25, mouse.product_id, 'RESTOCK', 100, keyboard.product_id, 'RESTOCK', 50]
  );

  // Order for Jane
  const { rows: [order] } = await pool.query(
    'INSERT INTO "order" (customer_id, status) VALUES ($1, $2) RETURNING *',
    [jane.customer_id, 'PENDING']
  );

  // List items
  await pool.query(
    'INSERT INTO list (order_id, product_id, line_number, quantity, unit_price) VALUES ($1, $2, $3, $4, $5)',
    [order.order_id, laptop.product_id, 1, 1, 999.99]
  );
  await pool.query(
    'INSERT INTO list (order_id, product_id, line_number, quantity, unit_price) VALUES ($1, $2, $3, $4, $5)',
    [order.order_id, mouse.product_id, 2, 1, 29.99]
  );

  // Inventory transactions for the sale
  await pool.query(
    'INSERT INTO inventory_transaction (product_id, order_id, transaction_type, quantity_change) VALUES ($1, $2, $3, $4), ($5, $6, $7, $8)',
    [laptop.product_id, order.order_id, 'SALE', -1, mouse.product_id, order.order_id, 'SALE', -1]
  );

  // Payment
  await pool.query(
    'INSERT INTO payment (order_id, amount, payment_date, method, status) VALUES ($1, $2, $3, $4, $5)',
    [order.order_id, 1029.98, new Date(), 'CREDIT_CARD', 'COMPLETED']
  );

  console.log('Done!');
  console.log('  Customers: Jane Doe, John Smith');
  console.log('  Products:  Laptop (x25), Wireless Mouse (x100), Mechanical Keyboard (x50)');
  console.log('  Orders:    1 order for Jane with payment');
  await pool.end();
}

main().catch((e) => { console.error(e); process.exit(1); });
