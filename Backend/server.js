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

const app = express();
app.use(helmet());
app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" })); // Allow images to be loaded cross-origin
app.use(cors({
  origin: ["http://localhost:5173", "https://port-folio-sage-beta.vercel.app"],
  credentials: true
}));
app.use(express.json());

// Ensure uploads directory exists
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir);
}

// Serve uploaded files statically
app.use('/uploads', express.static('uploads'));

// Setup Multer for Image Uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

const fileFilter = (req, file, cb) => {
  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type. Only JPEG, PNG, GIF, and WEBP images are allowed.'), false);
  }
};

const upload = multer({ 
  storage: storage,
  fileFilter: fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 } // 5MB limit
});

// MongoDB Connection
const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/portfolioDB';
mongoose.connect(MONGO_URI)
  .then(() => console.log('✅ Connected to MongoDB Successfully!'))
  .catch((err) => console.error('❌ Error connecting to MongoDB:', err.message));

// Project Schema
const projectSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  image: { type: String, required: true }, // Will store the file path or URL
  github: { type: String },
  live: { type: String }
}, { timestamps: true });

const Project = mongoose.model('Project', projectSchema);

// Admin Password from Environment (Default: admin123)
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'shiva@9595';

// Auth Middleware
const verifyAdmin = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Unauthorized access. Token missing.' });
  }
  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'super_secret_fallback_key');
    if (decoded.role !== 'admin') {
      return res.status(403).json({ error: 'Forbidden. Admin role required.' });
    }
    next();
  } catch (err) {
    return res.status(401).json({ error: 'Unauthorized access. Invalid or expired token.' });
  }
};

// Rate limiters
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // Limit each IP to 5 login requests per window
  message: { error: 'Too many login attempts, please try again later.' }
});

const contactLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 10,
  message: { error: 'Too many messages sent. Please try again later.' }
});

// Login Route
app.post('/api/login', loginLimiter, (req, res) => {
  const { password } = req.body;
  if (password === ADMIN_PASSWORD) {
    const token = jwt.sign({ role: 'admin' }, process.env.JWT_SECRET || 'super_secret_fallback_key', { expiresIn: '1d' });
    res.json({ message: 'Login successful', token: token });
  } else {
    res.status(401).json({ error: 'Invalid password' });
  }
});

// Get all projects (Public)
app.get('/api/projects', async (req, res) => {
  try {
    const projects = await Project.find().sort({ createdAt: -1 });
    const formattedProjects = projects.map(p => ({
      id: p._id,
      title: p.title,
      description: p.description,
      image: p.image.startsWith('http') ? p.image : `${APP_URL}/${p.image}`,
      github: p.github,
      live: p.live
    }));
    res.json(formattedProjects);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Add a new project (Protected + File Upload)
app.post('/api/projects', verifyAdmin, (req, res, next) => {
  upload.single('image')(req, res, function (err) {
    if (err) {
      return res.status(400).json({ error: err.message });
    }
    next();
  });
}, async (req, res) => {
  try {
    const { title, description, github, live } = req.body;
    let imagePath = '';

    if (req.file) {
      imagePath = 'uploads/' + req.file.filename;
    } else {
      return res.status(400).json({ error: 'Image file is required' });
    }

    const newProject = new Project({
      title,
      description,
      image: imagePath,
      github,
      live
    });

    const savedProject = await newProject.save();

    res.json({
      message: 'success',
      data: {
        id: savedProject._id,
        title: savedProject.title,
        description: savedProject.description,
        image: savedProject.image.startsWith('http') ? savedProject.image : `${APP_URL}/${savedProject.image}`,
        github: savedProject.github,
        live: savedProject.live
      }
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Update a project (Protected + Optional File Upload)
app.put('/api/projects/:id', verifyAdmin, (req, res, next) => {
  upload.single('image')(req, res, function (err) {
    if (err) {
      return res.status(400).json({ error: err.message });
    }
    next();
  });
}, async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, github, live } = req.body;

    const project = await Project.findById(id);
    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }

    project.title = title || project.title;
    project.description = description || project.description;
    project.github = github || project.github;
    project.live = live || project.live;

    // If a new image is uploaded, update it and delete the old one
    if (req.file) {
      const oldImage = project.image;
      project.image = 'uploads/' + req.file.filename;

      if (oldImage.startsWith('uploads/')) {
        const filePath = path.join(__dirname, oldImage);
        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath);
        }
      }
    }

    const updatedProject = await project.save();

    res.json({
      message: 'Updated successfully',
      data: {
        id: updatedProject._id,
        title: updatedProject.title,
        description: updatedProject.description,
        image: updatedProject.image.startsWith('http') ? updatedProject.image : `${APP_URL}/${updatedProject.image}`,
        github: updatedProject.github,
        live: updatedProject.live
      }
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Delete a project (Protected)
app.delete('/api/projects/:id', verifyAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const project = await Project.findById(id);

    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }

    // Delete image file from server if it's a local upload
    if (project.image.startsWith('uploads/')) {
      const filePath = path.join(__dirname, project.image);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    }

    await Project.findByIdAndDelete(id);
    res.json({ message: 'Deleted successfully' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Contact Form Route
app.post('/api/contact', contactLimiter, async (req, res) => {
  const { user_name, user_email, subject, message } = req.body;

  if (!user_name || !user_email || !message) {
    return res.status(400).json({ error: 'Please provide name, email, and message.' });
  }

  try {
    // Configure NodeMailer Transport
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER, // e.g., your.email@gmail.com
        pass: process.env.EMAIL_PASS  // e.g., Google App Password
      }
    });

    // 1. Email to You (Admin)
    const adminMailOptions = {
      from: process.env.EMAIL_USER,
      to: process.env.EMAIL_USER,
      replyTo: user_email,
      subject: `Portfolio Contact: ${subject || 'New Message'} from ${user_name}`,
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px; border: 1px solid #ddd; border-radius: 8px;">
          <h3 style="color: #8b5cf6;">New Contact Request</h3>
          <p><strong>Name:</strong> ${user_name}</p>
          <p><strong>Email:</strong> ${user_email}</p>
          <p><strong>Subject:</strong> ${subject}</p>
          <hr/>
          <p><strong>Message:</strong></p>
          <p style="white-space: pre-wrap;">${message}</p>
        </div>
      `
    };

    // 2. Auto-Reply to the User
    const userMailOptions = {
      from: process.env.EMAIL_USER,
      to: user_email,
      subject: 'Thank you for reaching out!',
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px; border: 1px solid #ddd; border-radius: 8px;">
          <h3 style="color: #8b5cf6;">Hello ${user_name},</h3>
          <p>Thank you for contacting me through my portfolio website!</p>
          <p>I have successfully received your message regarding "<strong>${subject}</strong>" and I will get back to you as soon as possible.</p>
          <br>
          <p>Best regards,</p>
          <p><strong>Shivam</strong></p>
        </div>
      `
    };

    // Send both emails
    await transporter.sendMail(adminMailOptions);
    await transporter.sendMail(userMailOptions);

    res.json({ message: 'Emails sent successfully!' });
  } catch (error) {
    console.error('Nodemailer Error:', error);
    res.status(500).json({ error: 'Failed to send email. Please check server email configuration.' });
  }
});

const PORT = process.env.PORT || 10000;
const APP_URL = process.env.APP_URL || `http://localhost:${PORT}`;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
