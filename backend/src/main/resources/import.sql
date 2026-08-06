-- Users
INSERT INTO tb_user (username, password, balance) VALUES ('john.doe', '$2a$10$eACCYoNOHEqXve8eIWT8CHOVAYufCR/7gD/oID1z2rDPOe9qATp_2', 1500.00);
INSERT INTO tb_user (username, password, balance) VALUES ('jane.smith', '$2a$10$eACCYoNOHEqXve8eIWT8CHOVAYufCR/7gD/oID1z2rDPOe9qATp_2', 2500.50);
INSERT INTO tb_user (username, password, balance) VALUES ('testuser', '$2a$10$sMHLX52NqDbb0ZobThENsuJDzAt7mtSQfkx4T.fQzvMIIohvmLnyK', 0.00);

-- Categories for john.doe (user_id = 1)
INSERT INTO tb_category (name, user_id) VALUES ('Electronics', 1);
INSERT INTO tb_category (name, user_id) VALUES ('Clothing', 1);

-- Categories for jane.smith (user_id = 2)
INSERT INTO tb_category (name, user_id) VALUES ('Sneakers', 2);

-- Items for john.doe (user_id = 1)
-- Item 1: Sold Laptop (Category: Electronics, id=1)
INSERT INTO tb_item (name, img_url, buy_price, sell_price, buy_date, sell_date, status, profit, margin, category_id) VALUES ('Used Laptop', 'https://example.com/laptop.jpg', 1200.00, 1450.00, '2023-10-01', '2023-10-15', 1, 250.00, 17.24, 1);
-- Item 2: Available T-Shirt (Category: Clothing, id=2)
INSERT INTO tb_item (name, img_url, buy_price, sell_price, buy_date, sell_date, status, profit, margin, category_id) VALUES ('Vintage T-Shirt', 'https://example.com/tshirt.jpg', 25.50, NULL, '2023-11-05', NULL, 0, NULL, NULL, 2);

-- Items for jane.smith (user_id = 2)
-- Item 3: Sold Sneakers (Category: Sneakers, id=3)
INSERT INTO tb_item (name, img_url, buy_price, sell_price, buy_date, sell_date, status, profit, margin, category_id) VALUES ('Limited Edition Runner', 'https://example.com/runner.jpg', 150.00, 225.00, '2023-09-20', '2023-10-05', 1, 75.00, 33.33, 3);
-- Item 4: Available Sneakers (Category: Sneakers, id=3)
INSERT INTO tb_item (name, img_url, buy_price, sell_price, buy_date, sell_date, status, profit, margin, category_id) VALUES ('Everyday Casual Shoes', 'https://example.com/casual.jpg', 90.00, NULL, '2023-11-10', NULL, 0, NULL, NULL, 3);
