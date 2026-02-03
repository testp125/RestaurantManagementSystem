CREATE DATABASE restaurant_db;
USE restaurant_db;

-- Admin table
CREATE TABLE admins (
    admin_id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100),
    email VARCHAR(100) UNIQUE,
    password VARCHAR(400)
);

-- Customer table
CREATE TABLE customers (
    customer_id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100),
    email VARCHAR(100) UNIQUE,
    password VARCHAR(100),
    phone VARCHAR(15)
);

-- Food Items table
CREATE TABLE foodItems (
    fid INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100),
    price DECIMAL(7,2),
    description VARCHAR(300),
    image VARCHAR(100),
    category VARCHAR(50)
);

-- Orders table
CREATE TABLE orders (
    oid INT PRIMARY KEY AUTO_INCREMENT,
    customer_id INT,
    odate TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deldate TIMESTAMP,
    total_amount DECIMAL(9,2),
    status ENUM('PENDING','PROCESSING','CANCELLED','DELIVERED') DEFAULT 'PENDING',
    payment_status ENUM('PENDING','PAID','FAILED','REFUNDED') DEFAULT 'PENDING',
    payment_id VARCHAR(255),
    payment_method VARCHAR(50),
    FOREIGN KEY (customer_id) REFERENCES customers(customer_id) ON DELETE CASCADE ON UPDATE CASCADE
);

-- Order Details table
CREATE TABLE orderdetails (
    oid INT,
    fid INT,
    quantity INT,
    PRIMARY KEY (oid, fid),
    FOREIGN KEY (oid) REFERENCES orders(oid) ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY (fid) REFERENCES foodItems(fid) ON DELETE CASCADE ON UPDATE CASCADE
);

-- Booking table
CREATE TABLE booking (
    Booking_ID INT PRIMARY KEY AUTO_INCREMENT,
    Date DATE,
    Time TIME,
    No_Of_People INT,
    Customer_ID INT,
    status ENUM('PENDING','CONFIRMED','CANCELLED','COMPLETED') DEFAULT 'PENDING',
    payment_status ENUM('PENDING','PAID','FAILED','REFUNDED') DEFAULT 'PENDING',
    payment_id VARCHAR(255),
    payment_method VARCHAR(50),
    booking_amount DECIMAL(9,2) DEFAULT 0.00,
    FOREIGN KEY (Customer_ID) REFERENCES customers(customer_id) ON DELETE CASCADE
);

-- Feedback table
CREATE TABLE feedback (
    Feedback_ID INT AUTO_INCREMENT PRIMARY KEY,
    Message TEXT NOT NULL,
    Date DATE,
    Customer_ID INT,
    FOREIGN KEY (Customer_ID) REFERENCES customers(customer_id) ON DELETE CASCADE
);

CREATE TABLE payments (
  id INT PRIMARY KEY AUTO_INCREMENT,
  customer_id INT,
  payment_id VARCHAR(100),
  gateway VARCHAR(50),
  amount DECIMAL(10,2),
  status VARCHAR(20),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


CREATE TABLE customer_activity (
  id INT AUTO_INCREMENT PRIMARY KEY,
  customer_id INT NOT NULL,
  activity_type VARCHAR(50),
  description VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

