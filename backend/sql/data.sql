
-- CUSTOMERS
INSERT INTO customer (first_name, last_name, email)
VALUES ('Jane', 'Doe', 'jane@example.com');

INSERT INTO customer (first_name, last_name, email)
VALUES ('John', 'Smith', 'john@example.com');
-- PRODUCTS
INSERT INTO product (name, sku, price)
VALUES ('Laptop', 'LAP-001', 999.99);          -- boundary is highest price

INSERT INTO product (name, sku, price)
VALUES ('Wireless Mouse', 'MOU-001', 29.99);   -- boundary is lowest price

INSERT INTO product (name, sku, price)
VALUES ('Mechanical Keyboard', 'KEY-001', 79.99);


-- INVENTORY RESTOCK
INSERT INTO inventory_transaction (product_id, order_id, transaction_type, quantity_change)
VALUES
(1, NULL, 'RESTOCK', 25),
(2, NULL, 'RESTOCK', 100),                     -- boundary is highest restock quantity
(3, NULL, 'RESTOCK', 50);

-- ORDER
INSERT INTO "order" (customer_id)
VALUES (1);

-- LIST ITEMS
-- boundary: minimum quantity of 1
INSERT INTO list (order_id, product_id, line_number, quantity, unit_price)
VALUES (1, 1, 1, 1, 999.99);

INSERT INTO list (order_id, product_id, line_number, quantity, unit_price)
VALUES (1, 2, 2, 1, 29.99);                    -- boundary is lowest unit_price

-- INVENTORY (SALE)
-- boundary: negative quantity_change (-1) which means stock reduction
INSERT INTO inventory_transaction (product_id, order_id, transaction_type, quantity_change)
VALUES
(1, 1, 'SALE', -1),                            -- boundary is negative value
(2, 1, 'SALE', -1);

-- PAYMENT
INSERT INTO payment (order_id, amount, payment_date, method, status)
VALUES (1, 1029.98, NOW(), 'CREDIT_CARD', 'COMPLETED');