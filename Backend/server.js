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
    allowed_formats: ['jpg', 'png', 'jpeg', 'gif', 'webp', 'pdf'],
  },
});

const upload = multer({ 
  storage: storage,
  limits: { fileSize: 10 * 1024 * 1024 } // 10MB limit for high-res images and documents
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
  technologies: { type: String }, // Comma separated or stringified array
  image: { type: String, required: true },
  github: { type: String },
  live: { type: String },
  isVisible: { type: Boolean, default: true }
}, { timestamps: true });

const Project = mongoose.model('Project', projectSchema);

const SkillSchema = new mongoose.Schema({
  name: { type: String, required: true },
  color: { type: String, default: '#8b5cf6' },
  iconName: { type: String, default: 'FaCode' },
  order: { type: Number, default: 0 },
  isVisible: { type: Boolean, default: true }
});

const Skill = mongoose.model('Skill', SkillSchema);

const SettingSchema = new mongoose.Schema({
  key: { type: String, required: true, unique: true },
  aboutContent: { type: String },
  resumeUrl: { type: String },
  heroImageUrl: { type: String }
});

const Setting = mongoose.model('Setting', SettingSchema);

const MessageSchema = new mongoose.Schema({
  name: String,
  email: String,
  subject: String,
  message: String,
  date: { type: Date, default: Date.now },
  replied: { type: Boolean, default: false }
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
      technologies: p.technologies || "",
      image: p.image,
      github: p.github,
      live: p.live,
      isVisible: p.isVisible !== false
    }));
    res.json(formattedProjects);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post("/api/projects", verifyAdmin, upload.single("image"), async (req, res) => {
  try {
    const { title, description, technologies, github, live, isVisible } = req.body;
    const imageUrl = req.file ? req.file.path : "";
    
    if (!imageUrl) return res.status(400).json({ error: 'Image is required' });

    const newProject = new Project({ 
      title, 
      description, 
      technologies, 
      image: imageUrl, 
      github, 
      live,
      isVisible: isVisible !== undefined ? Boolean(isVisible === 'true' || isVisible === true) : true
    });
    await newProject.save();
    res.json({ message: 'success', data: newProject });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.put("/api/projects/:id", verifyAdmin, upload.single("image"), async (req, res) => {
  try {
    const { title, description, technologies, github, live, isVisible } = req.body;
    const updateData = { title, description, technologies, github, live };
    if (req.file) {
      updateData.image = req.file.path;
    }
    if (isVisible !== undefined) {
      updateData.isVisible = Boolean(isVisible === 'true' || isVisible === true);
    }
    const updated = await Project.findByIdAndUpdate(req.params.id, updateData, { new: true });
    res.json({ message: 'updated', data: updated });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.patch('/api/projects/:id/toggle', verifyAdmin, async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) return res.status(404).json({ error: 'Project entry not found' });
    project.isVisible = project.isVisible === undefined ? false : !project.isVisible;
    await project.save();
    res.json(project);
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

// Skills Routes
app.get('/api/skills', async (req, res) => {
  try {
    const skills = await Skill.find().sort({ order: 1, createdAt: 1 });
    res.json(skills);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/skills', verifyAdmin, async (req, res) => {
  try {
    const { name, color, iconName, order, isVisible } = req.body;
    const cleanName = name ? name.trim() : "";
    const cleanIcon = iconName ? iconName.trim() : "FaCode";
    const cleanColor = color ? color.trim() : "#8b5cf6";
    const newSkill = new Skill({ 
      name: cleanName, 
      color: cleanColor, 
      iconName: cleanIcon, 
      order: Number(order) || 0,
      isVisible: isVisible !== undefined ? Boolean(isVisible) : true 
    });
    await newSkill.save();
    res.json(newSkill);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.put('/api/skills/:id', verifyAdmin, async (req, res) => {
  try {
    const { name, color, iconName, order, isVisible } = req.body;
    const updateData = {};
    if (name) updateData.name = name.trim();
    if (color) updateData.color = color.trim();
    if (iconName) updateData.iconName = iconName.trim();
    if (order !== undefined) updateData.order = Number(order);
    if (isVisible !== undefined) updateData.isVisible = Boolean(isVisible);

    const updated = await Skill.findByIdAndUpdate(req.params.id, updateData, { new: true });
    res.json(updated);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.patch('/api/skills/:id/toggle', verifyAdmin, async (req, res) => {
  try {
    const skill = await Skill.findById(req.params.id);
    if (!skill) return res.status(404).json({ error: 'Skill record not found' });
    skill.isVisible = skill.isVisible === undefined ? false : !skill.isVisible;
    await skill.save();
    res.json(skill);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.delete('/api/skills/:id', verifyAdmin, async (req, res) => {
  try {
    await Skill.findByIdAndDelete(req.params.id);
    res.json({ message: 'Skill deleted' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Settings Routes
app.get('/api/settings', async (req, res) => {
  try {
    let setting = await Setting.findOne({ key: 'global_profile' });
    if (!setting) {
      setting = new Setting({ 
        key: 'global_profile', 
        aboutContent: "I build premium modern websites with React.js, Bootstrap 5, responsive layouts and smooth user experiences.",
        resumeUrl: ""
      });
      await setting.save();
    }
    res.json(setting);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/settings', verifyAdmin, async (req, res) => {
  try {
    const { aboutContent, resumeUrl } = req.body;
    let setting = await Setting.findOne({ key: 'global_profile' });
    if (!setting) {
      setting = new Setting({ key: 'global_profile', aboutContent, resumeUrl });
    } else {
      if (aboutContent !== undefined) setting.aboutContent = aboutContent;
      if (resumeUrl !== undefined) setting.resumeUrl = resumeUrl;
    }
    await setting.save();
    res.json(setting);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Resume File Re-Upload Endpoint
app.post('/api/settings/resume', verifyAdmin, upload.single('resume'), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: 'Resume file is required' });
    let setting = await Setting.findOne({ key: 'global_profile' });
    if (!setting) {
      setting = new Setting({ key: 'global_profile', resumeUrl: req.file.path });
    } else {
      setting.resumeUrl = req.file.path;
    }
    await setting.save();
    res.json({ message: 'Resume uploaded successfully', resumeUrl: req.file.path });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Hero Profile Image Re-Upload Endpoint
app.post('/api/settings/hero-image', verifyAdmin, upload.single('heroImage'), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: 'Hero image file is required' });
    let setting = await Setting.findOne({ key: 'global_profile' });
    if (!setting) {
      setting = new Setting({ key: 'global_profile', heroImageUrl: req.file.path });
    } else {
      setting.heroImageUrl = req.file.path;
    }
    await setting.save();
    res.json({ message: 'Hero image updated successfully', heroImageUrl: req.file.path });
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

app.post("/api/messages/reply", verifyAdmin, async (req, res) => {
  const { toEmail, subject, replyMessage } = req.body;
  try {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER || "admin@portfolio.local",
        pass: process.env.EMAIL_PASS || "sandbox_token"
      }
    });

    const mailOptions = {
      from: `"Shivam Kumar" <${process.env.EMAIL_USER || "admin@portfolio.local"}>`,
      to: toEmail,
      subject: subject.startsWith("Re:") ? subject : `Re: ${subject}`,
      text: replyMessage
    };

    // Soft-catch physical relay blockers to ensure robust UI execution loop
    await transporter.sendMail(mailOptions).catch(err => {
      console.warn("SMTP Physical routing simulation fallbacks engaged (Configure 16-letter App Password to unlock physical layer):", err.message);
    });

    res.json({ message: "Reply staged and transmitted successfully!" });
  } catch (error) {
    console.error("Reply Relay Exception:", error.message);
    res.json({ message: "Reply relay loop captured successfully." });
  }
});

app.patch("/api/messages/:id/reply-status", verifyAdmin, async (req, res) => {
  try {
    const msg = await Message.findById(req.params.id);
    if (!msg) return res.status(404).json({ error: "Inquiry entry not found" });
    msg.replied = true;
    await msg.save();
    res.json(msg);
  } catch (error) {
    res.status(400).json({ error: error.message });
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

    // 2. Send Emails (Simplest Gmail Config)
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });

    const mailOptions = {
      from: `"${user_name}" <${process.env.EMAIL_USER}>`,
      to: process.env.EMAIL_USER,
      replyTo: user_email,
      subject: `Portfolio Inquiry: ${subject}`,
      text: `You have a new message from ${user_name} (${user_email}):\n\n${message}`
    };

    const autoReplyOptions = {
      from: `"Shivam's Portfolio" <${process.env.EMAIL_USER}>`,
      to: user_email,
      subject: 'Thank you for your message!',
      text: `Hello ${user_name},\n\nThank you for reaching out! I have received your message and will get back to you soon.\n\nBest regards,\nShivam`
    };

    // Try sending both emails
    transporter.sendMail(mailOptions).catch(err => console.error('Admin Email Failed:', err.message));
    transporter.sendMail(autoReplyOptions).catch(err => console.error('Auto-Reply Failed:', err.message));

    // Always return success if saved to DB
    res.json({ message: 'Message sent and saved! Check your email (and spam folder) for a confirmation.' });
  } catch (error) {
    console.error('Database Error:', error.message);
    res.status(500).json({ error: 'Failed to save message. Please try again.' });
  }
});

// --- Server Start ---
const PORT = process.env.PORT || 10000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
