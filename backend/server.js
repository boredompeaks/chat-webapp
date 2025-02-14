import express from 'express';
import cors from 'cors';
import mysql from 'mysql2/promise';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const app = express();
app.use(cors());
app.use(express.json());

// Database connection pool
const pool = mysql.createPool({
  host: '193.203.184.196',
  user: 'u286068293_Malkani',
  password: 'bAbkywW3nwv3ZER',
  database: 'u286068293_Chatdb',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Auth middleware
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Authentication required' });
  }

  jwt.verify(token, 'your-secret-key', (err, user) => {
    if (err) {
      return res.status(403).json({ error: 'Invalid token' });
    }
    req.user = user;
    next();
  });
};

// Auth routes
app.post('/api/register', async (req, res) => {
  try {
    const { username, email, password } = req.body;
    
    // Validate input
    if (!username || !email || !password) {
      return res.status(400).json({ error: 'All fields are required' });
    }
    
    // Check if email already exists
    const [existingUsers] = await pool.execute(
      'SELECT * FROM users WHERE email = ?',
      [email]
    );
    
    if (existingUsers.length > 0) {
      return res.status(400).json({ error: 'Email already registered' });
    }
    
    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);
    
    // Insert user
    const [result] = await pool.execute(
      'INSERT INTO users (id, username, email, password_hash) VALUES (UUID(), ?, ?, ?)',
      [username, email, hashedPassword]
    );
    
    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ error: 'Registration failed' });
  }
});

app.post('/api/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Validate input
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }
    
    // Get user
    const [users] = await pool.execute(
      'SELECT * FROM users WHERE email = ?',
      [email]
    );
    
    if (users.length === 0) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    
    const user = users[0];
    
    // Check password
    const validPassword = await bcrypt.compare(password, user.password_hash);
    if (!validPassword) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    
    // Generate token
    const token = jwt.sign(
      { id: user.id, email: user.email },
      'your-secret-key',
      { expiresIn: '24h' }
    );
    
    res.json({
      token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Login failed' });
  }
});

// Message routes
app.post('/api/messages', authenticateToken, async (req, res) => {
  try {
    const { content } = req.body;
    const senderId = req.user.id;
    
    if (!content) {
      return res.status(400).json({ error: 'Message content is required' });
    }
    
    const [result] = await pool.execute(
      'INSERT INTO messages (id, sender_id, content, status) VALUES (UUID(), ?, ?, "sent")',
      [senderId, content]
    );
    
    const [messages] = await pool.execute(
      `SELECT m.*, u.username 
       FROM messages m 
       JOIN users u ON m.sender_id = u.id 
       WHERE m.id = LAST_INSERT_ID()`
    );
    
    res.status(201).json(messages[0]);
  } catch (error) {
    console.error('Error creating message:', error);
    res.status(500).json({ error: 'Failed to create message' });
  }
});

app.patch('/api/messages/:id/status', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    
    await pool.execute(
      'UPDATE messages SET status = ? WHERE id = ?',
      [status, id]
    );
    
    res.json({ success: true });
  } catch (error) {
    console.error('Error updating message status:', error);
    res.status(500).json({ error: 'Failed to update message status' });
  }
});

app.post('/api/messages/:id/react', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { reaction } = req.body;
    const userId = req.user.id;
    
    const [message] = await pool.execute(
      'SELECT reactions FROM messages WHERE id = ?',
      [id]
    );
    
    let reactions = message[0].reactions ? JSON.parse(message[0].reactions) : {};
    reactions[userId] = reaction;
    
    await pool.execute(
      'UPDATE messages SET reactions = ? WHERE id = ?',
      [JSON.stringify(reactions), id]
    );
    
    res.json({ success: true });
  } catch (error) {
    console.error('Error adding reaction:', error);
    res.status(500).json({ error: 'Failed to add reaction' });
  }
});

app.get('/api/messages', authenticateToken, async (req, res) => {
  try {
    const [messages] = await pool.execute(
      `SELECT m.*, u.username 
       FROM messages m 
       JOIN users u ON m.sender_id = u.id 
       ORDER BY m.created_at DESC 
       LIMIT 100`
    );
    res.json(messages);
  } catch (error) {
    console.error('Error fetching messages:', error);
    res.status(500).json({ error: 'Failed to fetch messages' });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
