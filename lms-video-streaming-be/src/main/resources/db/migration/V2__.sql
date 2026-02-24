ALTER TABLE orders
    ADD _code VARCHAR(255);

ALTER TABLE orders
    ALTER COLUMN _code SET NOT NULL;

ALTER TABLE orders
    ADD CONSTRAINT uc_orders__code UNIQUE (_code);

ALTER TABLE payments
    ALTER COLUMN _amount TYPE DECIMAL USING (_amount::DECIMAL);

ALTER TABLE courses
    ALTER COLUMN _price TYPE DECIMAL USING (_price::DECIMAL);

ALTER TABLE order_items
    ALTER COLUMN _price TYPE DECIMAL USING (_price::DECIMAL);

ALTER TABLE enrollments
    ALTER COLUMN _price_paid TYPE DECIMAL USING (_price_paid::DECIMAL);

ALTER TABLE courses
    ALTER COLUMN _sale_price TYPE DECIMAL USING (_sale_price::DECIMAL);

ALTER TABLE orders
    ALTER COLUMN _total_amount TYPE DECIMAL USING (_total_amount::DECIMAL);