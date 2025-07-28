CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(50) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  role VARCHAR(20) NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE facilities (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  model VARCHAR(50),
  serial_number VARCHAR(50) UNIQUE,
  location VARCHAR(100),
  manufacturer VARCHAR(100),
  purchase_date DATE,
  expiry_date DATE,
  status VARCHAR(20) DEFAULT '在库'
);

CREATE TABLE inventory_records (
  id INT AUTO_INCREMENT PRIMARY KEY,
  facility_id INT NOT NULL,
  operation_type VARCHAR(20) NOT NULL,
  quantity INT NOT NULL,
  operator_id INT NOT NULL,
  operation_time DATETIME DEFAULT CURRENT_TIMESTAMP,
  remark VARCHAR(255),
  FOREIGN KEY (facility_id) REFERENCES facilities(id),
  FOREIGN KEY (operator_id) REFERENCES users(id)
);

CREATE TABLE logs (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  action VARCHAR(100) NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id)
); 