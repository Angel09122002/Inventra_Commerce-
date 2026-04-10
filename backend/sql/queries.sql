
-- schema from schema.sql

CREATE TABLE IF NOT EXISTS customer (
  customer_id SERIAL      PRIMARY KEY,
  first_name  VARCHAR(100) NOT NULL,
  last_name   VARCHAR(100) NOT NULL,
  email       VARCHAR(255) UNIQUE NOT NULL
);

CREATE TABLE IF NOT EXISTS product (
  product_id SERIAL        PRIMARY KEY,
  sku        VARCHAR(100)  UNIQUE NOT NULL,
  name       VARCHAR(255)  NOT NULL,
  price      DECIMAL(10,2) NOT NULL
);

-- "order" is a reserved word in SQL, so we quote it
CREATE TABLE IF NOT EXISTS "order" (
  order_id    SERIAL      PRIMARY KEY,
  customer_id INT         NOT NULL REFERENCES customer(customer_id),
  order_date  TIMESTAMP   DEFAULT NOW(),
  status      VARCHAR(50) DEFAULT 'PENDING'
);

-- Composite PK matches the ERD (OrderID + ProductID + LineNumber)
CREATE TABLE IF NOT EXISTS list (
  order_id    INT           NOT NULL REFERENCES "order"(order_id) ON DELETE CASCADE,
  product_id  INT           NOT NULL REFERENCES product(product_id),
  line_number INT           NOT NULL,
  quantity    INT           NOT NULL,
  unit_price  DECIMAL(10,2) NOT NULL,
  PRIMARY KEY (order_id, product_id, line_number)
);

CREATE TABLE IF NOT EXISTS payment (
  payment_id   SERIAL        PRIMARY KEY,
  order_id     INT           UNIQUE NOT NULL REFERENCES "order"(order_id),
  amount       DECIMAL(10,2) NOT NULL,
  payment_date TIMESTAMP     NOT NULL,
  method       VARCHAR(50)   NOT NULL,
  status       VARCHAR(50)   DEFAULT 'PENDING'
);

CREATE TABLE IF NOT EXISTS inventory_transaction (
  transaction_id        SERIAL      PRIMARY KEY,
  product_id            INT         NOT NULL REFERENCES product(product_id),
  order_id              INT         REFERENCES "order"(order_id),
  transaction_type      VARCHAR(50) NOT NULL,
  quantity_change       INT         NOT NULL,
  transaction_timestamp TIMESTAMP   DEFAULT NOW()
);


--  seed data


-- Customers
INSERT INTO customer (first_name, last_name, email)
VALUES ('Jane', 'Doe', 'jane@example.com');

INSERT INTO customer (first_name, last_name, email)
VALUES ('John', 'Smith', 'john@example.com');

-- Products
INSERT INTO product (name, sku, price)
VALUES ('Laptop', 'LAP-001', 999.99);

INSERT INTO product (name, sku, price)
VALUES ('Wireless Mouse', 'MOU-001', 29.99);

INSERT INTO product (name, sku, price)
VALUES ('Mechanical Keyboard', 'KEY-001', 79.99);

 
-- 3 INVENTORY RESTOCK
 

 
INSERT INTO inventory_transaction (product_id, transaction_type, quantity_change)
VALUES
(1, 'RESTOCK', 25),
(2, 'RESTOCK', 100),
(3, 'RESTOCK', 50);

 
-- 4 CREATE ORDER
 

-- Assume Jane = customer_id 1
INSERT INTO "order" (customer_id, status)
VALUES (1, 'PENDING');


-- 5 ORDER ITEMS




INSERT INTO list (order_id, product_id, line_number, quantity, unit_price)
VALUES (1, 1, 1, 1, 999.99);

INSERT INTO list (order_id, product_id, line_number, quantity, unit_price)
VALUES (1, 2, 2, 1, 29.99);


-- 6 INVENTORY (SALE)


INSERT INTO inventory_transaction (product_id, order_id, transaction_type, quantity_change)
VALUES
(1, 1, 'SALE', -1),
(2, 1, 'SALE', -1);


-- 7 PAYMENT


INSERT INTO payment (order_id, amount, payment_date, method, status)
VALUES (1, 1029.98, NOW(), 'CREDIT_CARD', 'COMPLETED');

