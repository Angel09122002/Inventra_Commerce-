 -- seed data
  -- ----------------------------------------

  -- CUSTOMERS
  INSERT INTO customer (first_name, last_name, email)                                                                                                                                                                                          VALUES
    ('Jane',  'Doe',      'jane@example.com'),                                                                                                                                                                                                   ('John',  'Smith',    'john@example.com');

  -- PRODUCTS
  INSERT INTO product (name, sku, price)
  VALUES
    -- Max‑boundary price (typical for DECIMAL(10,2) can hold up to 9,999,999.99)
    ('Laptop',        'LAP-001', 9999999.99),
    ('Wireless Mouse','MOU-001', 0.00),           -- 0‑boundary price
    ('Mechanical Keyboard','KEY-001', 79.99);

  -- INVENTORY RESTOCK (order_id NULL allowed)
  INSERT INTO inventory_transaction (product_id, order_id, transaction_type, quantity_change)
  VALUES
    (1, NULL, 'RESTOCK', 25),
    (2, NULL, 'RESTOCK', 100),
    (3, NULL, 'RESTOCK', 50);

  -- ORDER (no status supplied → defaults to 'PENDING')
  INSERT INTO "order" (customer_id) VALUES (1);

  -- ORDER ITEMS
  INSERT INTO list (order_id, product_id, line_number, quantity, unit_price)
  VALUES
    -- 0‑boundary quantity test
    (1, 1, 1, 0, 999.99),
    -- normal item
    (1, 2, 2, 1, 29.99);

  -- INVENTORY (SALE) – negative quantity_change
  INSERT INTO inventory_transaction (product_id, order_id, transaction_type, quantity_change)
  VALUES
    (1, 1, 'SALE', -1),
    (2, 1, 'SALE', -1);

  -- PAYMENT
  INSERT INTO payment (order_id, amount, payment_date, method, status)
  VALUES
    (1, 1029.98, NOW(), 'CREDIT_CARD', 'COMPLETED');