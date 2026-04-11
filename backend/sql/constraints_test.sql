-- The seed script already added jane@example.com.
-- This should fail because the email column has to be unique.
INSERT INTO customer (first_name, last_name, email)
VALUES ('Janet', 'Duplicate', 'jane@example.com');
--ERROR: duplicate key value violates unique constraint "customer_email_key"

-- This should fail because customer_id 99967 does not exist.
-- The 'order' table needs an actual link to a real customer.
INSERT INTO "order" (customer_id, status)
VALUES (99967, 'PENDING');
--ERROR: insert or update on table "order" violates foreign key constraint "order_customer_id_fkey"

-- this should fail because name is required for every product.
INSERT INTO product (sku, price)
VALUES ('ERROR-SKU-101', 49.99);
--EROR: null value in column "name" violates not-null constraint

-- The payment table has a uNIQUE constraint on order_id.
INSERT INTO payment (order_id, amount, payment_date, method, status)
VALUES (1, 10.00, NOW(), 'CASH', 'PENDING');
-- ERROR: duplicate key value violates unique constraint "payment_order_id_key"