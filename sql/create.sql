/* Create a database */
CREATE DATABASE IF NOT EXISTS `react_node_rest_demo_db`;
USE react_node_rest_demo_db;


/* Create a table */
CREATE TABLE IF NOT EXISTS `books` (
  `id`    INT AUTO_INCREMENT PRIMARY KEY,
  `title` VARCHAR(45) NOT NULL,
  `desc`  VARCHAR(255) NOT NULL,
  `price` INT NOT NULL,
  `cover` VARCHAR(45) NULL
);

