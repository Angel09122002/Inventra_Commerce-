 
-- The seed script already added jane@example.com.
-- This should fail because the email column has to be unique.
INSERT INTO customer (first_name, last_name, email) 
VALUES ('Janet', 'Duplicate', 'jane@example.com');


 
-- This should fail because customer_id 99967 does not exist.
-- The 'order' table needs an actual link to a real customer.
INSERT INTO "order" (customer_id, status) 
VALUES (99967, 'PENDING');


 
-- this should fail because name is required for every product.
INSERT INTO product (sku, price) 
VALUES ('ERROR-SKU-101', 49.99);



-- The payment table has a uNIQUE constraint on order_id.
INSERT INTO payment (order_id, amount, payment_date, method, status)
VALUES (1, 10.00, NOW(), 'CASH', 'PENDING');