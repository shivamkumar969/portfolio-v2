require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const nodemailer = require('nodemailer');
const jwt = require('jsonwebtoken');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');

// --- Cloudinary Configuration ---
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const app = express();

// --- Security Middleware ---
app.use(helmet());
app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }));
app.use(cors({
  origin: ["http://localhost:5173", "https://portfolio-v2-rho-two-56.vercel.app"],
  credentials: true
}));
app.use(express.json());

// --- Multer Cloudinary Storage ---
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'portfolio_projects',
    allowed_formats: ['jpg', 'png', 'jpeg', 'gif', 'webp'],
  },
});

const upload = multer({ 
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 } // 5MB limit
});

// --- MongoDB Connection ---
const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/portfolioDB';
mongoose.connect(MONGO_URI)
  .then(() => console.log('✅ Connected to MongoDB Successfully!'))
  .catch((err) => console.error('❌ Error connecting to MongoDB:', err.message));

// --- Models ---
const projectSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  image: { type: String, required: true },
  github: { type: String },
  live: { type: String }
}, { timestamps: true });

const Project = mongoose.model('Project', projectSchema);

const MessageSchema = new mongoose.Schema({
  name: String,
  email: String,
  subject: String,
  message: String,
  date: { type: Date, default: Date.now }
});

const Message = mongoose.model("Message", MessageSchema);

// --- Auth Middleware ---
const verifyAdmin = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Unauthorized access.' });
  }
  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'super_secret_fallback_key');
    req.admin = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ error: 'Invalid token.' });
  }
};

// --- Rate Limiters ---
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: { error: 'Too many login attempts.' }
});

// --- Routes ---

// Admin Login
app.post('/api/login', loginLimiter, (req, res) => {
  const { password } = req.body;
  const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'shiva@9595';
  
  if (password === ADMIN_PASSWORD) {
    const token = jwt.sign({ role: 'admin' }, process.env.JWT_SECRET || 'super_secret_fallback_key', { expiresIn: '1d' });
    res.json({ message: 'Login successful', token: token });
  } else {
    res.status(401).json({ error: 'Invalid password' });
  }
});

// Project Routes
app.get('/api/projects', async (req, res) => {
  try {
    const projects = await Project.find().sort({ createdAt: -1 });
    const formattedProjects = projects.map(p => ({
      id: p._id,
      title: p.title,
      description: p.description,
      image: p.image,
      github: p.github,
      live: p.live
    }));
    res.json(formattedProjects);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post("/api/projects", verifyAdmin, upload.single("image"), async (req, res) => {
  try {
    const { title, description, github, live } = req.body;
    const imageUrl = req.file ? req.file.path : "";
    
    if (!imageUrl) return res.status(400).json({ error: 'Image is required' });

    const newProject = new Project({ title, description, image: imageUrl, github, live });
    await newProject.save();
    res.json({ message: 'success', data: newProject });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.delete('/api/projects/:id', verifyAdmin, async (req, res) => {
  try {
    await Project.findByIdAndDelete(req.params.id);
    res.json({ message: 'Deleted successfully' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Message Routes
app.get("/api/messages", verifyAdmin, async (req, res) => {
  try {
    const messages = await Message.find().sort({ date: -1 });
    res.json(messages);
  } catch (error) {
    res.status(500).json({ error: "Error fetching messages" });
  }
});

app.delete("/api/messages/:id", verifyAdmin, async (req, res) => {
  try {
    await Message.findByIdAndDelete(req.params.id);
    res.json({ message: "Message deleted" });
  } catch (error) {
    res.status(500).json({ error: "Error deleting message" });
  }
});

// Contact Route
app.post('/api/contact', async (req, res) => {
  const { user_name, user_email, subject, message } = req.body;

  try {
    // 1. Save to Database
    const newMessage = new Message({ name: user_name, email: user_email, subject, message });
    await newMessage.save();

    // 2. Send Emails (Master Fix for Gmail on Render)
    const transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 465,
      secure: true, // Use SSL for port 465
      pool: true,   // Use pooled connections
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      },
      tls: {
        rejectUnauthorized: false
      }
    });

    const mailOptions = {
      from: `"${user_name}" <${process.env.EMAIL_USER}>`,
      to: process.env.EMAIL_USER,
      replyTo: user_email,
      subject: `Portfolio: ${subject}`,
      text: `Name: ${user_name}\nEmail: ${user_email}\n\nMessage:\n${message}`
    };

    await transporter.sendMail(mailOptions);
    res.json({ message: 'Message sent and saved!' });
  } catch (error) {
    console.error('Nodemailer Error:', error.message);
    res.status(500).json({ error: `Server Error: ${error.message}` });
  }
});

// --- Server Start ---
const PORT = process.env.PORT || 10000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
