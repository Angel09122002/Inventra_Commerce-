-- Query 1: Show all customers
SELECT
  customer_id,
  first_name,
  last_name,
  email
FROM customer
ORDER BY customer_id;

-- Query 2: Show all products
SELECT
  product_id,
  sku,
  name,
  price
FROM product
ORDER BY product_id;

-- Query 3: Show all orders with customer names
SELECT
  o.order_id,
  c.first_name || ' ' || c.last_name AS customer_name,
  o.order_date,
  o.status,
  c.first_name,
  c.last_name,
  c.email
FROM "order" o
JOIN customer c
  ON o.customer_id = c.customer_id
ORDER BY o.order_id;

-- Query 4: Show all order items with product names
SELECT
  l.order_id,
  p.name AS product_name,
  l.quantity,
  l.unit_price,
  (l.quantity * l.unit_price) AS total_price
FROM list l
JOIN product p
  ON l.product_id = p.product_id
ORDER BY l.order_id, l.line_number;

-- Query 5: Show all payments with order and customer info
SELECT
  p.payment_id,
  o.order_id,
  c.first_name || ' ' || c.last_name AS customer_name,
  p.amount,
  p.payment_date,
  p.method,
  p.status
FROM payment p
JOIN "order" o
  ON p.order_id = o.order_id
JOIN customer c
  ON o.customer_id = c.customer_id
ORDER BY p.payment_id;

-- Query 6: Show inventory transactions with product names
SELECT
  it.transaction_id,
  p.name AS product_name,
  it.transaction_type,
  it.quantity_change,
  it.transaction_timestamp
FROM inventory_transaction it
JOIN product p
  ON it.product_id = p.product_id
ORDER BY p.product_id, it.transaction_timestamp;

-- Query 7: Show low stock products (less than 5 units)
SELECT
  p.product_id,
  p.sku,
  p.name,
  COALESCE(SUM(it.quantity_change), 0) AS current_stock
FROM product p
LEFT JOIN inventory_transaction it
  ON p.product_id = it.product_id
GROUP BY p.product_id, p.sku, p.name
HAVING COALESCE(SUM(it.quantity_change), 0) < 5
ORDER BY current_stock, p.product_id;

-- Query 8: Show total amount spent by each customer
SELECT
  c.customer_id,
  c.first_name,
  c.last_name,
  COALESCE(SUM(pay.amount), 0) AS total_spent
FROM customer c
LEFT JOIN "order" o
  ON c.customer_id = o.customer_id
LEFT JOIN payment pay
  ON o.order_id = pay.order_id
GROUP BY c.customer_id, c.first_name, c.last_name
ORDER BY total_spent DESC, c.customer_id;