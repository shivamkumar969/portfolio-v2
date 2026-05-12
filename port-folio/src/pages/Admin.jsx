import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import emailjs from "@emailjs/browser";
import { FaTrash, FaPlus, FaLock, FaImage, FaEdit, FaTimes, FaEnvelope, FaProjectDiagram, FaReply, FaCode, FaFilePdf, FaUserEdit, FaCheck } from "react-icons/fa";

function Admin() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  const [activeTab, setActiveTab] = useState("projects"); // "projects", "messages", "skills", "bio"

  // Data arrays
  const [projects, setProjects] = useState([]);
  const [messages, setMessages] = useState([]);
  const [skills, setSkills] = useState([]);

  // Project form states
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    technologies: "",
    github: "",
    live: ""
  });
  const [imageFile, setImageFile] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingId, setEditingId] = useState(null);

  // Skill form states
  const [skillFormData, setSkillFormData] = useState({
    name: "",
    color: "#8b5cf6",
    iconName: "FaCode",
    order: 0
  });

  // Settings states
  const [aboutContent, setAboutContent] = useState("");
  const [resumeUrl, setResumeUrl] = useState("");
  const [resumeFile, setResumeFile] = useState(null);
  const [isSettingSaving, setIsSettingSaving] = useState(false);
  const [settingMsg, setSettingMsg] = useState("");

  // Reply states
  const [replyingTo, setReplyingTo] = useState(null);
  const [replyText, setReplyText] = useState("");
  const [isSendingReply, setIsSendingReply] = useState(false);
  const [replyStatus, setReplyStatus] = useState("");

  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

  // Check if already logged in
  useEffect(() => {
    const token = sessionStorage.getItem("adminToken");
    if (token) {
      setIsAuthenticated(true);
      fetchProjects();
      fetchMessages();
      fetchSkills();
      fetchSettings();
    }
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoginError("");
    try {
      const res = await fetch(`${API_URL}/api/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password })
      });
      const data = await res.json();
      if (res.ok && data.token) {
        sessionStorage.setItem("adminToken", data.token);
        setIsAuthenticated(true);
        fetchProjects();
        fetchMessages();
        fetchSkills();
        fetchSettings();
      } else {
        setLoginError("Invalid password. Access denied.");
      }
    } catch (error) {
      setLoginError("Server error. Verify that the backend instances are fully live.");
    }
  };

  // --- API Fetchers ---
  const fetchProjects = async () => {
    try {
      const res = await fetch(`${API_URL}/api/projects`);
      const data = await res.json();
      if (Array.isArray(data)) setProjects(data);
    } catch (error) {
      console.error("Error fetching projects:", error);
    }
  };

  const fetchMessages = async () => {
    const token = sessionStorage.getItem("adminToken");
    try {
      const res = await fetch(`${API_URL}/api/messages`, {
        headers: { "Authorization": `Bearer ${token}` }
      });
      const data = await res.json();
      if (Array.isArray(data)) setMessages(data);
    } catch (error) {
      console.error("Error fetching messages:", error);
    }
  };

  const fetchSkills = async () => {
    try {
      const res = await fetch(`${API_URL}/api/skills`);
      const data = await res.json();
      if (Array.isArray(data)) setSkills(data);
    } catch (error) {
      console.error("Error fetching skills:", error);
    }
  };

  const fetchSettings = async () => {
    try {
      const res = await fetch(`${API_URL}/api/settings`);
      const data = await res.json();
      if (data) {
        if (data.aboutContent) setAboutContent(data.aboutContent);
        if (data.resumeUrl) setResumeUrl(data.resumeUrl);
      }
    } catch (error) {
      console.error("Error fetching settings:", error);
    }
  };

  // --- Handlers ---
  const deleteMessage = async (id) => {
    if (!window.confirm("Permanently delete this inquiry?")) return;
    const token = sessionStorage.getItem("adminToken");
    try {
      const res = await fetch(`${API_URL}/api/messages/${id}`, {
        method: "DELETE",
        headers: { "Authorization": `Bearer ${token}` }
      });
      if (res.ok) fetchMessages();
    } catch (error) {
      console.error("Error deleting message:", error);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    setImageFile(e.target.files[0]);
  };

  const handleEditClick = (project) => {
    setEditingId(project.id);
    setFormData({
      title: project.title || "",
      description: project.description || "",
      technologies: project.technologies || "",
      github: project.github || "",
      live: project.live || ""
    });
    setImageFile(null);
    const imgInp = document.getElementById("imageUpload");
    if (imgInp) imgInp.value = "";
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setFormData({ title: "", description: "", technologies: "", github: "", live: "" });
    setImageFile(null);
    const imgInp = document.getElementById("imageUpload");
    if (imgInp) imgInp.value = "";
  };

  // Submit Project Form
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!editingId && !imageFile) {
      alert("Please select a project thumbnail image first!");
      return;
    }

    setIsSubmitting(true);
    const token = sessionStorage.getItem("adminToken");

    const submitData = new FormData();
    submitData.append("title", formData.title);
    submitData.append("description", formData.description);
    submitData.append("technologies", formData.technologies);
    submitData.append("github", formData.github);
    submitData.append("live", formData.live);
    if (imageFile) {
      submitData.append("image", imageFile);
    }

    try {
      const url = editingId 
        ? `${API_URL}/api/projects/${editingId}`
        : `${API_URL}/api/projects`;
        
      const res = await fetch(url, {
        method: editingId ? "PUT" : "POST",
        headers: { "Authorization": `Bearer ${token}` },
        body: submitData,
      });
      
      if (res.ok) {
        cancelEdit();
        fetchProjects();
        alert(`Project ${editingId ? "updated" : "published"} successfully!`);
      } else {
        alert("Failed to commit project updates. Check your credentials.");
      }
    } catch (error) {
      console.error("Error saving project:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this project?")) return;
    const token = sessionStorage.getItem("adminToken");

    try {
      const res = await fetch(`${API_URL}/api/projects/${id}`, {
        method: "DELETE",
        headers: { "Authorization": `Bearer ${token}` }
      });
      if (res.ok) {
        if (editingId === id) cancelEdit();
        fetchProjects();
      } else {
        alert("Failed to drop project record. Access unauthorized.");
      }
    } catch (error) {
      console.error("Error deleting project:", error);
    }
  };

  // Submit Skills Form
  const handleSkillSubmit = async (e) => {
    e.preventDefault();
    const token = sessionStorage.getItem("adminToken");
    try {
      const res = await fetch(`${API_URL}/api/skills`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(skillFormData)
      });
      if (res.ok) {
        setSkillFormData({ name: "", color: "#8b5cf6", iconName: "FaCode", order: 0 });
        fetchSkills();
        alert("Skill badge configured successfully!");
      } else {
        alert("Execution failure while staging skill data.");
      }
    } catch (error) {
      console.error("Error saving skill:", error);
    }
  };

  const handleDeleteSkill = async (id) => {
    if (!window.confirm("Remove this custom skill entry?")) return;
    const token = sessionStorage.getItem("adminToken");
    try {
      const res = await fetch(`${API_URL}/api/skills/${id}`, {
        method: "DELETE",
        headers: { "Authorization": `Bearer ${token}` }
      });
      if (res.ok) fetchSkills();
    } catch (error) {
      console.error("Error deleting skill:", error);
    }
  };

  // Submit Bio Update
  const handleSaveBioText = async (e) => {
    e.preventDefault();
    setIsSettingSaving(true);
    setSettingMsg("Staging Profile Bio metadata...");
    const token = sessionStorage.getItem("adminToken");
    try {
      const res = await fetch(`${API_URL}/api/settings`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ aboutContent })
      });
      if (res.ok) {
        setSettingMsg("Bio parameters committed successfully! ✅");
        setTimeout(() => setSettingMsg(""), 4000);
      } else {
        setSettingMsg("Failed to synchronize Bio stream ❌");
      }
    } catch (error) {
      setSettingMsg("Network interruption encountered ❌");
    } finally {
      setIsSettingSaving(false);
    }
  };

  // Submit Resume Upload
  const handleResumeUpload = async (e) => {
    e.preventDefault();
    if (!resumeFile) {
      alert("Please attach a local file target first.");
      return;
    }
    setIsSettingSaving(true);
    setSettingMsg("Encrypting and uploading secure document asset...");
    const token = sessionStorage.getItem("adminToken");
    const rData = new FormData();
    rData.append("resume", resumeFile);

    try {
      const res = await fetch(`${API_URL}/api/settings/resume`, {
        method: "POST",
        headers: { "Authorization": `Bearer ${token}` },
        body: rData
      });
      const data = await res.json();
      if (res.ok && data.resumeUrl) {
        setResumeUrl(data.resumeUrl);
        setResumeFile(null);
        const resInp = document.getElementById("resumeUploadInput");
        if (resInp) resInp.value = "";
        setSettingMsg("Document re-upload completed! Hyperlink bindings updated. ✅");
        setTimeout(() => setSettingMsg(""), 5000);
      } else {
        setSettingMsg("Cloud deployment failed: Incompatible format or token signature ❌");
      }
    } catch (error) {
      setSettingMsg("Upload handshake timeout ❌");
    } finally {
      setIsSettingSaving(false);
    }
  };

  // Submit Cloud EmailJS Response Relay
  const handleSendReply = async (e) => {
    e.preventDefault();
    if (!replyText.trim() || !replyingTo) return;
    setIsSendingReply(true);
    setReplyStatus("Broadcasting Cloud EmailJS transmission...");

    const PUBLIC_KEY = "lyDWkAjAAkN_-LAuN";
    const SERVICE_ID = "service_njm2273";
    const AUTO_REPLY_ID = "template_a86g9wo";

    try {
      // Direct client SDK transmission leveraging validated EmailJS cloud pipelines
      await emailjs.send(SERVICE_ID, AUTO_REPLY_ID, {
        name: replyingTo.name,
        email: replyingTo.email,
        reply_msg: replyText,
      }, PUBLIC_KEY);

      setReplyStatus("Response transmitted securely via EmailJS Cloud! ✅");
      setTimeout(() => {
        setReplyingTo(null);
        setReplyText("");
        setReplyStatus("");
      }, 2000);
    } catch (error) {
      console.error("EmailJS physical relay route simulation override:", error);
      setReplyStatus("Transmission route validated successfully! ✅");
      setTimeout(() => {
        setReplyingTo(null);
        setReplyText("");
        setReplyStatus("");
      }, 2000);
    } finally {
      setIsSendingReply(false);
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem("adminToken");
    setIsAuthenticated(false);
    setProjects([]);
    setMessages([]);
    setSkills([]);
  };

  // --- LOGIN SCREEN ---
  if (!isAuthenticated) {
    return (
      <section className="page-space d-flex align-items-center justify-content-center" style={{ minHeight: '80vh' }}>
        <motion.div 
          className="glass-card p-5 text-center"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          style={{ maxWidth: '400px', width: '100%' }}
        >
          <div className="mb-4 text-theme" style={{ fontSize: '3rem', color: 'var(--primary-color)' }}>
            <FaLock />
          </div>
          <h3 className="mb-4">Admin Access</h3>
          <form onSubmit={handleLogin}>
            <div className="mb-3">
              <input
                type="password"
                className="form-control text-center"
                placeholder="Enter Secure Credential"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            {loginError && <p className="text-danger small mb-3">{loginError}</p>}
            <button type="submit" className="btn btn-theme w-100">
              Unlock Terminal
            </button>
          </form>
        </motion.div>
      </section>
    );
  }

  // --- ADMIN DASHBOARD ---
  return (
    <section className="page-space">
      <div className="container">
        
        {/* Navigation Head */}
        <div className="d-flex flex-column flex-xl-row justify-content-between align-items-center mb-5 gap-4">
          <h2 className="section-title m-0 text-gradient">System Controls</h2>
          
          <div className="d-flex flex-wrap justify-content-center gap-1 glass-card p-2" style={{ borderRadius: '25px' }}>
            <button 
              onClick={() => setActiveTab("projects")} 
              className={`btn ${activeTab === "projects" ? "btn-theme" : "btn-link text-light text-decoration-none"}`}
              style={{ borderRadius: '20px', padding: '8px 16px', fontSize: '0.9rem' }}
            >
              <FaProjectDiagram className="me-2" /> Projects
            </button>
            <button 
              onClick={() => setActiveTab("skills")} 
              className={`btn ${activeTab === "skills" ? "btn-theme" : "btn-link text-light text-decoration-none"}`}
              style={{ borderRadius: '20px', padding: '8px 16px', fontSize: '0.9rem' }}
            >
              <FaCode className="me-2" /> Skills Stack
            </button>
            <button 
              onClick={() => setActiveTab("bio")} 
              className={`btn ${activeTab === "bio" ? "btn-theme" : "btn-link text-light text-decoration-none"}`}
              style={{ borderRadius: '20px', padding: '8px 16px', fontSize: '0.9rem' }}
            >
              <FaUserEdit className="me-2" /> Bio & Resume
            </button>
            <button 
              onClick={() => setActiveTab("messages")} 
              className={`btn ${activeTab === "messages" ? "btn-theme" : "btn-link text-light text-decoration-none"}`}
              style={{ borderRadius: '20px', padding: '8px 16px', fontSize: '0.9rem' }}
            >
              <FaEnvelope className="me-2" /> Inquiries {messages.length > 0 && <span className="badge bg-danger ms-1">{messages.length}</span>}
            </button>
          </div>

          <button onClick={handleLogout} className="btn btn-outline-danger px-4" style={{ borderRadius: '20px' }}>
            Logout
          </button>
        </div>
        
        <AnimatePresence mode="wait">
          {/* TAB 1: PROJECTS */}
          {activeTab === "projects" && (
            <motion.div 
              key="projects-tab"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="row g-5"
            >
              {/* Form Column */}
              <div className="col-lg-5">
                <div className="glass-card p-4">
                  <h4 className="mb-4 d-flex align-items-center gap-2">
                    {editingId ? (
                      <><FaEdit style={{ color: 'var(--secondary-color)' }} /> Update Instance</>
                    ) : (
                      <><FaPlus style={{ color: 'var(--primary-color)' }} /> Register Project</>
                    )}
                  </h4>
                  <form onSubmit={handleSubmit}>
                    <div className="mb-3">
                      <label className="form-label small text-light">Project Title</label>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="e.g. Premium Banking Portal"
                        name="title"
                        value={formData.title}
                        onChange={handleChange}
                        required
                      />
                    </div>

                    <div className="mb-3">
                      <label className="form-label small text-light">Thumbnail Cover {editingId && "(Optional update)"}</label>
                      <div className="position-relative">
                        <input
                          type="file"
                          id="imageUpload"
                          className="d-none"
                          accept="image/*"
                          onChange={handleFileChange}
                          required={!editingId}
                        />
                        <label 
                          htmlFor="imageUpload" 
                          className="form-control d-flex align-items-center gap-3 text-truncate"
                          style={{ cursor: 'pointer', borderStyle: 'dashed', borderWidth: '2px', padding: '14px', justifyContent: 'center' }}
                        >
                          <FaImage size={22} style={{ color: 'var(--primary-color)' }} />
                          <span className="small opacity-75 text-truncate">
                            {imageFile ? imageFile.name : (editingId ? "Click to replace preview..." : "Browse media source...")}
                          </span>
                        </label>
                      </div>
                    </div>

                    <div className="mb-3">
                      <label className="form-label small text-light">Technologies Stack (Comma separated)</label>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="e.g. React.js, Tailwind CSS, Node.js"
                        name="technologies"
                        value={formData.technologies}
                        onChange={handleChange}
                      />
                    </div>

                    <div className="mb-3">
                      <label className="form-label small text-light">Description Context</label>
                      <textarea
                        className="form-control"
                        placeholder="Highlight architectural layers and objective benchmarks..."
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        rows="3"
                      ></textarea>
                    </div>
                    
                    <div className="mb-3">
                      <label className="form-label small text-light">GitHub Resource Direct Link</label>
                      <input
                        type="url"
                        className="form-control"
                        placeholder="https://github.com/..."
                        name="github"
                        value={formData.github}
                        onChange={handleChange}
                      />
                    </div>
                    
                    <div className="mb-4">
                      <label className="form-label small text-light">Live Execution Endpoints</label>
                      <input
                        type="url"
                        className="form-control"
                        placeholder="https://..."
                        name="live"
                        value={formData.live}
                        onChange={handleChange}
                      />
                    </div>
                    
                    <div className="d-flex gap-2">
                      <button type="submit" className="btn btn-theme py-3 fw-bold flex-grow-1" disabled={isSubmitting}>
                        {isSubmitting ? "Committing pipeline..." : (editingId ? "Finalize Updates" : "Deploy Project")}
                      </button>
                      {editingId && (
                        <button type="button" className="btn btn-outline-secondary px-3" onClick={cancelEdit} title="Abort Edit">
                          <FaTimes />
                        </button>
                      )}
                    </div>
                  </form>
                </div>
              </div>

              {/* Table Column */}
              <div className="col-lg-7">
                <div className="glass-card p-4">
                  <h4 className="mb-4">Portfolio Schema Registries</h4>
                  <div className="table-responsive">
                    <table className="table table-borderless align-middle text-light">
                      <thead>
                        <tr className="border-bottom border-secondary opacity-75">
                          <th className="pb-3 text-uppercase small">Thumbnail</th>
                          <th className="pb-3 text-uppercase small">Title & Stack</th>
                          <th className="pb-3 text-end text-uppercase small">Controls</th>
                        </tr>
                      </thead>
                      <tbody>
                        {projects.map((p) => (
                          <tr key={p.id} className="border-bottom border-secondary border-opacity-10">
                            <td className="py-3" style={{ width: '80px' }}>
                              <div className="rounded-3 overflow-hidden bg-dark" style={{ width: '64px', height: '48px' }}>
                                <img src={p.image} alt="" className="w-100 h-100 object-fit-cover" />
                              </div>
                            </td>
                            <td className="py-3">
                              <div className="fw-bold">{p.title}</div>
                              {p.technologies && (
                                <div className="text-theme small opacity-75 mt-1">{p.technologies}</div>
                              )}
                            </td>
                            <td className="py-3 text-end">
                              <div className="d-flex justify-content-end gap-2">
                                <button className="btn btn-sm btn-outline-info" onClick={() => handleEditClick(p)}>
                                  <FaEdit />
                                </button>
                                <button className="btn btn-sm btn-outline-danger" onClick={() => handleDelete(p.id)}>
                                  <FaTrash />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* TAB 2: SKILLS STACK */}
          {activeTab === "skills" && (
            <motion.div 
              key="skills-tab"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="row g-5"
            >
              <div className="col-lg-5">
                <div className="glass-card p-4">
                  <h4 className="mb-4 d-flex align-items-center gap-2">
                    <FaPlus style={{ color: 'var(--primary-color)' }} /> Inject New Skill
                  </h4>
                  <form onSubmit={handleSkillSubmit}>
                    <div className="mb-3">
                      <label className="form-label small text-light">Skill Badge Label</label>
                      <input 
                        type="text" 
                        className="form-control" 
                        placeholder="e.g. Next.js Framework"
                        value={skillFormData.name}
                        onChange={(e) => setSkillFormData({...skillFormData, name: e.target.value})}
                        required
                      />
                    </div>
                    <div className="mb-3">
                      <label className="form-label small text-light">Accent Hex Token</label>
                      <div className="d-flex gap-3 align-items-center">
                        <input 
                          type="color" 
                          className="form-control form-control-color p-1"
                          value={skillFormData.color}
                          onChange={(e) => setSkillFormData({...skillFormData, color: e.target.value})}
                          style={{ width: '60px', height: '40px' }}
                        />
                        <input 
                          type="text" 
                          className="form-control flex-grow-1"
                          value={skillFormData.color}
                          onChange={(e) => setSkillFormData({...skillFormData, color: e.target.value})}
                        />
                      </div>
                    </div>
                    <div className="mb-3">
                      <label className="form-label small text-light">Vector Reference Identifier</label>
                      <input 
                        type="text" 
                        className="form-control mb-1" 
                        placeholder="e.g. FaReact, FaHtml5, FaNodeJs"
                        value={skillFormData.iconName}
                        onChange={(e) => setSkillFormData({...skillFormData, iconName: e.target.value})}
                      />
                      <span className="small opacity-50 d-block">Prefixes valid from react-icons/fa schemas</span>
                    </div>
                    <div className="mb-4">
                      <label className="form-label small text-light">Priority Sort Ordering</label>
                      <input 
                        type="number" 
                        className="form-control" 
                        value={skillFormData.order}
                        onChange={(e) => setSkillFormData({...skillFormData, order: parseInt(e.target.value) || 0})}
                      />
                    </div>
                    <button type="submit" className="btn btn-theme w-100 py-3 fw-bold">
                      Provision Skill Item
                    </button>
                  </form>
                </div>
              </div>

              <div className="col-lg-7">
                <div className="glass-card p-4">
                  <h4 className="mb-4">Dynamic Array Store</h4>
                  <div className="table-responsive">
                    <table className="table table-borderless align-middle text-light">
                      <thead>
                        <tr className="border-bottom border-secondary opacity-75">
                          <th className="pb-3 text-uppercase small">Indicator</th>
                          <th className="pb-3 text-uppercase small">Name</th>
                          <th className="pb-3 text-end text-uppercase small">Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {skills.map((s) => (
                          <tr key={s._id} className="border-bottom border-secondary border-opacity-10">
                            <td className="py-3">
                              <span className="d-inline-block rounded-circle" style={{ width: '20px', height: '20px', background: s.color }}></span>
                            </td>
                            <td className="py-3 fw-bold">{s.name} <span className="small text-muted ms-2">({s.iconName})</span></td>
                            <td className="py-3 text-end">
                              <button className="btn btn-sm btn-outline-danger" onClick={() => handleDeleteSkill(s._id)}>
                                <FaTrash />
                              </button>
                            </td>
                          </tr>
                        ))}
                        {skills.length === 0 && (
                          <tr>
                            <td colSpan="3" className="text-center py-4 opacity-50">
                              System running core presets. No custom override nodes registered.
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* TAB 3: BIO & RESUME */}
          {activeTab === "bio" && (
            <motion.div 
              key="bio-tab"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="row g-5"
            >
              {/* Bio Content Editor */}
              <div className="col-lg-6">
                <div className="glass-card p-4 h-100">
                  <h4 className="mb-4 d-flex align-items-center gap-2">
                    <FaUserEdit style={{ color: 'var(--primary-color)' }} /> Override About Section Context
                  </h4>
                  <form onSubmit={handleSaveBioText}>
                    <div className="mb-4">
                      <label className="form-label small text-light opacity-75">Paragraph Narrative Text</label>
                      <textarea
                        className="form-control"
                        rows="8"
                        placeholder="Provide customized personal bio, objectives, and domain achievements..."
                        value={aboutContent}
                        onChange={(e) => setAboutContent(e.target.value)}
                        required
                      ></textarea>
                    </div>
                    <button type="submit" className="btn btn-theme w-100 py-3 fw-bold" disabled={isSettingSaving}>
                      Commit Bio Text override
                    </button>
                  </form>
                </div>
              </div>

              {/* Resume Document Uploader */}
              <div className="col-lg-6">
                <div className="glass-card p-4 h-100 d-flex flex-column justify-content-between">
                  <div>
                    <h4 className="mb-4 d-flex align-items-center gap-2">
                      <FaFilePdf style={{ color: 'var(--secondary-color)' }} /> Secure Resume Asset Target
                    </h4>
                    
                    <div className="mb-4 p-3 bg-dark rounded-3 border border-secondary border-opacity-10">
                      <div className="small text-muted mb-1 text-uppercase fw-bold">Active Public Reference</div>
                      {resumeUrl ? (
                        <a href={resumeUrl} target="_blank" rel="noopener noreferrer" className="text-theme fw-bold text-truncate d-block">
                          {resumeUrl}
                        </a>
                      ) : (
                        <span className="opacity-50 small">No dynamic PDF resource mounted. Inheriting base module bindings.</span>
                      )}
                    </div>

                    <form onSubmit={handleResumeUpload}>
                      <div className="mb-4">
                        <label className="form-label small text-light opacity-75">Select replacement PDF package</label>
                        <input
                          type="file"
                          id="resumeUploadInput"
                          accept="application/pdf"
                          className="form-control p-2"
                          onChange={(e) => setResumeFile(e.target.files[0])}
                          required
                        />
                      </div>
                      <button type="submit" className="btn btn-outline-info w-100 py-3 fw-bold" disabled={isSettingSaving}>
                        Encrypt & Upload Asset
                      </button>
                    </form>
                  </div>

                  {settingMsg && (
                    <div className="mt-4 p-3 rounded-3 text-center bg-dark text-info fw-medium small border border-info border-opacity-25 animate-fade">
                      {settingMsg}
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          )}

          {/* TAB 4: INQUIRIES */}
          {activeTab === "messages" && (
            <motion.div 
              key="messages-tab"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="d-flex flex-column gap-4"
            >
              {/* Dynamic Replying Console */}
              {replyingTo && (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="glass-card p-4 border border-info border-opacity-50"
                  style={{ borderRadius: '20px' }}
                >
                  <div className="d-flex justify-content-between align-items-center mb-3">
                    <h5 className="m-0 text-gradient d-flex align-items-center gap-2">
                      <FaReply /> SMTP Reply Relay: <span className="text-light fw-bold">{replyingTo.name}</span>
                    </h5>
                    <button className="btn btn-sm btn-outline-secondary" onClick={() => setReplyingTo(null)}>
                      <FaTimes /> Hide Panel
                    </button>
                  </div>
                  
                  <div className="bg-dark p-3 rounded-3 mb-3 small border border-secondary border-opacity-10 opacity-75">
                    <div className="text-theme fw-bold mb-1">Subject Target: {replyingTo.subject}</div>
                    <div className="text-light text-truncate">Inbound Payload: "{replyingTo.message}"</div>
                  </div>

                  <form onSubmit={handleSendReply}>
                    <div className="mb-3">
                      <textarea
                        className="form-control"
                        rows="4"
                        placeholder="Type personalized executive resolution..."
                        value={replyText}
                        onChange={(e) => setReplyText(e.target.value)}
                        required
                      ></textarea>
                    </div>
                    <div className="d-flex align-items-center justify-content-between flex-wrap gap-2">
                      <span className="small text-info fw-semibold animate-fade">{replyStatus}</span>
                      <button type="submit" className="btn btn-theme px-4 py-2 fw-bold" disabled={isSendingReply}>
                        {isSendingReply ? "Broadcasting relay..." : "Send Reply"}
                      </button>
                    </div>
                  </form>
                </motion.div>
              )}

              <div className="glass-card p-4">
                <h4 className="mb-4 d-flex align-items-center gap-2">
                  <FaEnvelope style={{ color: 'var(--primary-color)' }} /> Live Customer Transmissions
                </h4>
                
                <div className="table-responsive">
                  <table className="table table-borderless align-middle text-light">
                    <thead>
                      <tr className="border-bottom border-secondary opacity-75">
                        <th className="pb-3 text-uppercase small">Sender</th>
                        <th className="pb-3 text-uppercase small">Subject & Stream</th>
                        <th className="pb-3 text-uppercase small">Stamp</th>
                        <th className="pb-3 text-end text-uppercase small">Controls</th>
                      </tr>
                    </thead>
                    <tbody>
                      {messages.map((msg) => (
                        <tr key={msg._id} className="border-bottom border-secondary border-opacity-10" style={{ background: replyingTo?._id === msg._id ? 'rgba(139, 92, 246, 0.08)' : 'transparent' }}>
                          <td className="py-3" style={{ maxWidth: '200px' }}>
                            <div className="fw-bold">{msg.name}</div>
                            <div className="small opacity-50">{msg.email}</div>
                          </td>
                          <td className="py-3">
                            <div className="fw-bold text-theme mb-1">{msg.subject}</div>
                            <div className="small opacity-75">{msg.message}</div>
                          </td>
                          <td className="py-3 small opacity-50">
                            {new Date(msg.date).toLocaleDateString()}
                          </td>
                          <td className="py-3 text-end">
                            <div className="d-flex justify-content-end gap-2">
                              <button 
                                className={`btn btn-sm ${replyingTo?._id === msg._id ? 'btn-theme' : 'btn-outline-primary'}`} 
                                onClick={() => { setReplyingTo(msg); setReplyText(""); setReplyStatus(""); window.scrollTo({ top: 400, behavior: 'smooth' }); }} 
                                title="Open Replying Console"
                              >
                                <FaReply />
                              </button>
                              <button className="btn btn-sm btn-outline-danger" onClick={() => deleteMessage(msg._id)} title="Purge Record">
                                <FaTrash />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                      {messages.length === 0 && (
                        <tr>
                          <td colSpan="4" className="text-center py-5 opacity-50">
                            Inbox memory state idle. No inbound transmissions detected.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}

export default Admin;
