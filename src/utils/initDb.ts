import { query } from './dbConnection';

export const initDatabase = async () => {
  try {
    // Users table
    await query(`
      CREATE TABLE IF NOT EXISTS users (
        id VARCHAR(36) PRIMARY KEY,
        username VARCHAR(255) NOT NULL UNIQUE,
        email VARCHAR(255) NOT NULL UNIQUE,
        password_hash VARCHAR(255) NOT NULL,
        avatar_url VARCHAR(255),
        is_online BOOLEAN DEFAULT false,
        last_seen TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `);

    // Conversations table
    await query(`
      CREATE TABLE IF NOT EXISTS conversations (
        id VARCHAR(36) PRIMARY KEY,
        name VARCHAR(255),
        is_group BOOLEAN DEFAULT false,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `);

    // Messages table
    await query(`
      CREATE TABLE IF NOT EXISTS messages (
        id VARCHAR(36) PRIMARY KEY,
        conversation_id VARCHAR(36) NOT NULL,
        sender_id VARCHAR(36) NOT NULL,
        content TEXT,
        content_type ENUM('text', 'image', 'file', 'voice') DEFAULT 'text',
        is_read BOOLEAN DEFAULT false,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (conversation_id) REFERENCES conversations(id),
        FOREIGN KEY (sender_id) REFERENCES users(id)
      )
    `);

    // Media table for attachments
    await query(`
      CREATE TABLE IF NOT EXISTS media (
        id VARCHAR(36) PRIMARY KEY,
        message_id VARCHAR(36) NOT NULL,
        url VARCHAR(255) NOT NULL,
        type VARCHAR(50) NOT NULL,
        size INT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (message_id) REFERENCES messages(id)
      )
    `);

    console.log('Database tables created successfully');
  } catch (error) {
    console.error('Error initializing database:', error);
    throw error;
  }
};