const mysql = require('mysql2');

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
}).promise();

const checkAndAlterUsersTable = async () => {
    try {
      const checkColumnSql = `
        SELECT COUNT(*) AS count
        FROM information_schema.columns
        WHERE table_schema = ? AND table_name = 'users' AND column_name = 'username';
      `;
      const dbName = process.env.DB_NAME || 'cheongsol_db';
      const [rows] = await pool.query(checkColumnSql, [dbName]);

      if (rows[0].count === 0) {
        console.log("Column 'username' not found in 'users' table. Altering table...");
        // Add username column after id, and also make email non-unique if it was unique before
        const alterTableSql = `ALTER TABLE users ADD COLUMN username VARCHAR(255) NOT NULL UNIQUE AFTER id, DROP INDEX email`;
        await pool.query(alterTableSql);
        console.log("Table 'users' altered successfully.");
      }
    } catch (error) {
        // Ignore "Duplicate column name" error if it happens in a race condition
        if (error.code === 'ER_DUP_FIELDNAME') {
            console.log("Column 'username' already exists.");
            return;
        }
        // Also ignore if the unique index on email doesn't exist to be dropped
        if (error.code === 'ER_CANT_DROP_FIELD_OR_KEY') {
            console.log("Unique key on 'email' might not exist, which is fine.");
            return;
        }
      console.error("Error altering users table:", error);
    }
  };

const createTables = async () => {
  try {
    // Original CREATE TABLE statement (might create table without username initially)
    const usersTable = `
      CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        email VARCHAR(255) NOT NULL,
        password VARCHAR(255) NOT NULL,
        isAdmin BOOLEAN DEFAULT false,
        createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `;

    const announcementsTable = `
      CREATE TABLE IF NOT EXISTS announcements (
        id INT AUTO_INCREMENT PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        content TEXT NOT NULL,
        date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        isPopup BOOLEAN DEFAULT false
      );
    `;

    const boothsTable = `
      CREATE TABLE IF NOT EXISTS booths (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        category VARCHAR(255),
        description TEXT
      );
    `;

    const suggestionsTable = `
      CREATE TABLE IF NOT EXISTS suggestions (
        id INT AUTO_INCREMENT PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        content TEXT NOT NULL,
        author VARCHAR(255),
        status ENUM('received', 'in_progress', 'completed') DEFAULT 'received',
        createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `;

    const scheduleImagesTable = `
      CREATE TABLE IF NOT EXISTS schedule_images (
        id INT AUTO_INCREMENT PRIMARY KEY,
        image_url VARCHAR(255) NOT NULL,
        createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `;

    await pool.query(usersTable);
    console.log("Table 'users' created or already exists.");
    // Now, check and add the username column if it's missing
    await checkAndAlterUsersTable();
    
    await pool.query(announcementsTable);
    await pool.query(boothsTable);
    await pool.query(suggestionsTable);
    await pool.query(scheduleImagesTable);
    console.log("Other tables created or already exist.");

  } catch (error) {
    console.error("Error creating tables:", error);
  }
};

module.exports = {
  pool,
  createTables
};