CREATE DATABASE asics_store;

USE asics_store;

CREATE TABLE products (
    id TINYINT UNSIGNED AUTO_INCREMENT,
    name VARCHAR(60) UNIQUE NOT NULL,
    description VARCHAR(255),
    category ENUM('Running', 'Tennis', 'Volleyball'),
    price FLOAT(5,2),
    created_at DATETIME DEFAULT NOW(),
    updated_at DATETIME,
    CONSTRAINT product_pk PRIMARY KEY (id)
);

INSERT INTO products (name, description, category, price) VALUES
    ('SUPERBLAST', 'Lorem ipsum dolor sit amet.', 'Running', 120.00),
    ('GELKAYANO 30', 'Lorem ipsum dolor sit amet.', 'Running', 80.00),
    ('METASPEED EDGE', 'Lorem ipsum dolor sit amet.', 'Running', 100.00),
    ('COURT FF 3', 'Lorem ipsum dolor sit amet.', 'Tennis', 135.00),
    ('GEL RESOLUTION 9', 'Lorem ipsum dolor sit amet.', 'Tennis', 99.00),
    ('SOLUTION SPEED FF 2', 'Lorem ipsum dolor sit amet.', 'Tennis', 150.00),
    ('UPCOURT 5', 'Lorem ipsum dolor sit amet.', 'Volleyball', 100.00),
    ('NETBURNER BALISTIC FF 2', 'Lorem ipsum dolor sit amet.', 'Volleyball', 90.00),
    ('GEL-TACTIC 12', 'Lorem ipsum dolor sit amet.', 'Volleyball', 110.00);

CREATE TABLE users (
    id TINYINT UNSIGNED AUTO_INCREMENT,
    name VARCHAR(30) NOT NULL,
    email VARCHAR(50) NOT NULL,
    password VARCHAR(60) NOT NULL,
    created_at DATETIME DEFAULT NOW(),
    updated_at DATETIME,
    CONSTRAINT user_pk PRIMARY KEY (id)
);

INSERT INTO users (name, email, password) VALUES
    ('John Doe', 'johndoe@example.com', 'plain_text'),
    ('Jane Doe', 'janedoe@example.com', 'plain_text'),
    ('Otis Miller', 'otismiller@example.com', 'plain_text'),
    ('Samantha Groves', 'root@example.com', 'plain_text'),
    ('Lionel Fusco', 'lfusco@example.com', 'plain_text');

CREATE TABLE orders (
    id TINYINT UNSIGNED AUTO_INCREMENT,
    user_id TINYINT UNSIGNED,
    order_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    total_price DECIMAL(10, 2),
    status ENUM('Pending', 'Shipped', 'Completed') DEFAULT 'Pending',
    CONSTRAINT order_pk PRIMARY KEY (id),
    CONSTRAINT user_fk FOREIGN KEY (user_id) REFERENCES users (id)
);

INSERT INTO orders (user_id, status) VALUES
(1, 'Completed');

CREATE TABLE order_items (
    id TINYINT UNSIGNED AUTO_INCREMENT,
    order_id TINYINT UNSIGNED,
    product_id TINYINT UNSIGNED,
    quantity TINYINT UNSIGNED,
    price_per_unit DECIMAL(5, 2),
    CONSTRAINT order_items_pk PRIMARY KEY (id),
    CONSTRAINT order_fk FOREIGN KEY (order_id) REFERENCES orders (id),
    CONSTRAINT product_fk FOREIGN KEY (product_id) REFERENCES products (id)
);

INSERT INTO order_items (order_id, product_id, quantity, price_per_unit)
VALUES (1, 1, 2, (SELECT price FROM products WHERE id=product_id));

UPDATE orders o
SET total_price = (
    SELECT SUM(oi.quantity * oi.price_per_unit)
    FROM order_items oi
    WHERE oi.order_id = o.id
);
