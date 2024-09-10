const express = require('express');
const cors = require('cors');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const PORT = 3001;
const User = require('./models/users'); 
const sequelize = require('./config/config'); 

const JWT_SECRET = 'helloji'; 
const server = express();

// Middleware
server.use(express.urlencoded({ extended: false }));
server.use(express.json());
server.use(cors({
  origin: 'http://localhost:3000', 
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type', 'Authorization'], 
}));


const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  console.log(token)

  if (token == null) return res.sendStatus(401); 

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
};


server.post('/create/new-profile', async (req, res) => {
  try {
    const { first_name, email, phone, password, re_enter_password } = req.body;
    if (password !== re_enter_password) {
      return res.status(400).json({ message: "Passwords do not match" });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    await User.create({ first_name, email, phone, password: hashedPassword });
    res.status(201).json({ message: "Profile created" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error creating profile" });
  }
});

server.post('/login-as-existing-user/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    const user = await User.findOne({ where: { email } });

    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({ message: "Invalid password" });
    }

    const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, { expiresIn: '1h' });
    res.json({ token });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error logging in" });
  }
});


server.get('/search/get-all-users', authenticateToken, async (req, res) => {
  try {
    const { first_name } = req.query;

    if (!first_name) {
      return res.status(400).json({ message: "Enter name" });
    }

    // Fetch user by first_name and select specific fields
    const user = await User.findOne({
      where: { first_name },
      attributes: ['first_name', 'email', ]
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.status(200).json({ user });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});


sequelize.sync()
  .then(() => {
    server.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error('Failed to sync with the database:', err);
  });
