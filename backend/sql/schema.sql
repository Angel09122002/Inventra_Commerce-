-- Inventra Commerce — Database Schema

CREATE TABLE IF NOT EXISTS customer (
  customer_id SERIAL      PRIMARY KEY,
  first_name  VARCHAR(100) NOT NULL,
  last_name   VARCHAR(100) NOT NULL,
  email       VARCHAR(255) UNIQUE NOT NULL,
  CONSTRAINT customer_email_unique UNIQUE (email)
);

CREATE TABLE IF NOT EXISTS product (
  product_id SERIAL        PRIMARY KEY,
  sku        VARCHAR(100)  NOT NULL,
  name       VARCHAR(255)  NOT NULL,
  price      DECIMAL(10,2) NOT NULL,
  CONSTRAINT product_sku_unique UNIQUE (sku),
  CONSTRAINT product_price_nonnegative CHECK (price >= 0)
);

-- "order" is a reserved word in SQL, so we quote it

CREATE TABLE IF NOT EXISTS "order" (
  order_id    SERIAL      PRIMARY KEY,
  customer_id INT         NOT NULL REFERENCES customer(customer_id),
  order_date  TIMESTAMP   DEFAULT NOW(),
  status      VARCHAR(50) DEFAULT 'PENDING',
  CONSTRAINT order_status_valid CHECK (status IN ('PENDING', 'COMPLETED', 'CANCELLED'))
);

-- Composite PK matches the ERD (OrderID + ProductID + LineNumber)

CREATE TABLE IF NOT EXISTS list (
  order_id    INT           NOT NULL REFERENCES "order"(order_id) ON DELETE CASCADE,
  product_id  INT           NOT NULL REFERENCES product(product_id),
  unit_price  DECIMAL(10,2) NOT NULL,
  line_number INT           NOT NULL,
  quantity    INT           NOT NULL,
  PRIMARY KEY (order_id, product_id, line_number),
  CONSTRAINT list_quantity_positive CHECK (quantity > 0),
  CONSTRAINT list_unit_price_nonnegative CHECK (unit_price >= 0)
);

CREATE TABLE IF NOT EXISTS payment (
  payment_id   SERIAL        PRIMARY KEY,
  order_id     INT           NOT NULL REFERENCES "order"(order_id),
  amount       DECIMAL(10,2) NOT NULL,
  payment_date TIMESTAMP     NOT NULL,
  method       VARCHAR(50)   NOT NULL,
  status       VARCHAR(50)   DEFAULT 'PENDING',
  CONSTRAINT payment_order_id_unique UNIQUE (order_id),
  CONSTRAINT payment_amount_nonnegative CHECK (amount >= 0),
  CONSTRAINT payment_status_valid CHECK (status IN ('PENDING', 'COMPLETED', 'FAILED'))
);

CREATE TABLE IF NOT EXISTS inventory_transaction (
  transaction_id        SERIAL      PRIMARY KEY,
  product_id            INT         NOT NULL REFERENCES product(product_id),
  order_id              INT         REFERENCES "order"(order_id),
  transaction_type      VARCHAR(50) NOT NULL,
  quantity_change       INT         NOT NULL,
  transaction_timestamp TIMESTAMP   DEFAULT NOW(),
  CONSTRAINT inventory_transaction_type_valid
    CHECK (transaction_type IN ('RESTOCK', 'SALE', 'ADJUSTMENT')),
  CONSTRAINT inventory_transaction_quantity_nonzero
    CHECK (quantity_change <> 0)
);
