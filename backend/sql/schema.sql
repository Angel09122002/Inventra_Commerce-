-- Inventra Commerce — Database Schema

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
