import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { FaTrash, FaPlus, FaLock, FaImage, FaEdit, FaTimes, FaEnvelope, FaProjectDiagram, FaReply } from "react-icons/fa";

function Admin() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  const [activeTab, setActiveTab] = useState("projects"); // "projects" or "messages"

  const [projects, setProjects] = useState([]);
  const [messages, setMessages] = useState([]);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    github: "",
    live: ""
  });
  const [imageFile, setImageFile] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

  // Check if already logged in
  useEffect(() => {
    const token = sessionStorage.getItem("adminToken");
    if (token) {
      setIsAuthenticated(true);
      fetchProjects();
      fetchMessages();
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
      } else {
        setLoginError("Invalid password. Access denied.");
      }
    } catch (error) {
      setLoginError("Server error. Make sure the backend is running.");
    }
  };

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

  const deleteMessage = async (id) => {
    if (!window.confirm("Delete this message?")) return;
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
      github: project.github || "",
      live: project.live || ""
    });
    setImageFile(null);
    document.getElementById("imageUpload").value = "";
    // Scroll to form smoothly
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setFormData({ title: "", description: "", github: "", live: "" });
    setImageFile(null);
    document.getElementById("imageUpload").value = "";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!editingId && !imageFile) {
      alert("Please select an image file first!");
      return;
    }

    setIsSubmitting(true);
    const token = sessionStorage.getItem("adminToken");

    const submitData = new FormData();
    submitData.append("title", formData.title);
    submitData.append("description", formData.description);
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
        headers: {
          "Authorization": `Bearer ${token}`
        },
        body: submitData,
      });
      
      if (res.ok) {
        setFormData({ title: "", description: "", github: "", live: "" });
        setImageFile(null);
        setEditingId(null);
        document.getElementById("imageUpload").value = "";
        fetchProjects();
        alert(`Project ${editingId ? "updated" : "added"} successfully!`);
      } else {
        alert("Failed to save project. You might not be authorized.");
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
        headers: {
          "Authorization": `Bearer ${token}`
        }
      });
      if (res.ok) {
        if (editingId === id) cancelEdit();
        fetchProjects();
      } else {
        alert("Failed to delete project. Unauthorized.");
      }
    } catch (error) {
      console.error("Error deleting project:", error);
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem("adminToken");
    setIsAuthenticated(false);
    setProjects([]);
    setMessages([]);
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
                placeholder="Enter Admin Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            {loginError && <p className="text-danger small mb-3">{loginError}</p>}
            <button type="submit" className="btn btn-theme w-100">
              Unlock Dashboard
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
        
        <div className="d-flex flex-column flex-md-row justify-content-between align-items-center mb-5 gap-4">
          <h2 className="section-title m-0 text-gradient">Admin Dashboard</h2>
          
          <div className="d-flex gap-2 glass-card p-1" style={{ borderRadius: '40px' }}>
            <button 
              onClick={() => setActiveTab("projects")} 
              className={`btn ${activeTab === "projects" ? "btn-theme" : "btn-link text-light text-decoration-none"}`}
              style={{ borderRadius: '30px', padding: '8px 20px' }}
            >
              <FaProjectDiagram className="me-2" /> Projects
            </button>
            <button 
              onClick={() => setActiveTab("messages")} 
              className={`btn ${activeTab === "messages" ? "btn-theme" : "btn-link text-light text-decoration-none"}`}
              style={{ borderRadius: '30px', padding: '8px 20px' }}
            >
              <FaEnvelope className="me-2" /> Messages {messages.length > 0 && <span className="badge bg-danger ms-1">{messages.length}</span>}
            </button>
          </div>

          <button onClick={handleLogout} className="btn btn-outline-danger" style={{ borderRadius: '30px' }}>
            Logout
          </button>
        </div>
        
        <AnimatePresence mode="wait">
          {activeTab === "projects" ? (
            <motion.div 
              key="projects-tab"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="row g-5"
            >
              {/* Add/Edit Project Form */}
              <div className="col-lg-5">
                <div className="glass-card p-4">
                  <h4 className="mb-4 d-flex align-items-center gap-2">
                    {editingId ? (
                      <><FaEdit style={{ color: 'var(--secondary-color)' }} /> Edit Project</>
                    ) : (
                      <><FaPlus style={{ color: 'var(--primary-color)' }} /> Add New Project</>
                    )}
                  </h4>
                  <form onSubmit={handleSubmit}>
                    <div className="mb-3">
                      <label className="form-label small text-light">Project Title</label>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="e.g. E-Commerce App"
                        name="title"
                        value={formData.title}
                        onChange={handleChange}
                        required
                      />
                    </div>

                    <div className="mb-3">
                      <label className="form-label small text-light">Image Upload {editingId && "(Optional)"}</label>
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
                          className="form-control d-flex align-items-center gap-3"
                          style={{ 
                            cursor: 'pointer', 
                            borderStyle: 'dashed', 
                            borderWidth: '2px',
                            padding: '16px',
                            justifyContent: 'center'
                          }}
                        >
                          <FaImage size={24} style={{ color: 'var(--primary-color)' }} />
                          <span style={{ color: 'var(--text-light)' }}>
                            {imageFile ? imageFile.name : (editingId ? "Click to replace image..." : "Click to browse image file...")}
                          </span>
                        </label>
                      </div>
                    </div>

                    <div className="mb-3">
                      <label className="form-label small text-light">Description</label>
                      <textarea
                        className="form-control"
                        placeholder="Short description of the project..."
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        rows="3"
                      ></textarea>
                    </div>
                    
                    <div className="mb-3">
                      <label className="form-label small text-light">GitHub Repository URL</label>
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
                      <label className="form-label small text-light">Live Project URL</label>
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
                      <button type="submit" className="btn btn-theme w-100 py-3 fw-bold flex-grow-1" disabled={isSubmitting}>
                        {isSubmitting ? "Saving..." : (editingId ? "Update Project" : "Publish Project")}
                      </button>
                      {editingId && (
                        <button type="button" className="btn btn-outline-secondary" onClick={cancelEdit} title="Cancel Edit">
                          <FaTimes />
                        </button>
                      )}
                    </div>
                  </form>
                </div>
              </div>

              {/* Manage Projects Table */}
              <div className="col-lg-7">
                <div className="glass-card p-4">
                  <h4 className="mb-4">Manage Portfolio</h4>
                  <div className="table-responsive">
                    <table className="table table-borderless align-middle text-light">
                      <thead>
                        <tr className="border-bottom border-secondary">
                          <th className="pb-3 text-uppercase small opacity-75">Preview</th>
                          <th className="pb-3 text-uppercase small opacity-75">Title</th>
                          <th className="pb-3 text-end text-uppercase small opacity-75">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {projects.map((project) => (
                          <tr key={project._id} className="border-bottom border-secondary border-opacity-10">
                            <td className="py-3">
                              <img 
                                src={project.imageUrl} 
                                alt={project.title} 
                                className="rounded"
                                style={{ width: '60px', height: '45px', objectFit: 'cover' }} 
                                onError={(e) => e.target.src = "https://via.placeholder.com/60x45?text=Error"}
                              />
                            </td>
                            <td className="py-3 fw-bold">{project.title}</td>
                            <td className="py-3 text-end">
                              <div className="d-flex justify-content-end gap-2">
                                <button className="btn btn-sm btn-outline-info" onClick={() => handleEditClick(project)}>
                                  <FaEdit />
                                </button>
                                <button className="btn btn-sm btn-outline-danger" onClick={() => handleDelete(project._id)}>
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
          ) : (
            <motion.div 
              key="messages-tab"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <div className="glass-card p-4">
                <h4 className="mb-4 d-flex align-items-center gap-2">
                  <FaEnvelope style={{ color: 'var(--primary-color)' }} /> 
                  User Messages
                </h4>
                
                <div className="table-responsive">
                  <table className="table table-borderless align-middle text-light">
                    <thead>
                      <tr className="border-bottom border-secondary">
                        <th className="pb-3 text-uppercase small opacity-75">Sender</th>
                        <th className="pb-3 text-uppercase small opacity-75">Subject & Message</th>
                        <th className="pb-3 text-uppercase small opacity-75">Date</th>
                        <th className="pb-3 text-end text-uppercase small opacity-75">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {messages.map((msg) => (
                        <tr key={msg._id} className="border-bottom border-secondary border-opacity-10">
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
                              <a 
                                href={`mailto:${msg.email}?subject=Re: ${msg.subject}`} 
                                className="btn btn-sm btn-outline-primary"
                                title="Reply via Email"
                              >
                                <FaReply />
                              </a>
                              <button 
                                className="btn btn-sm btn-outline-danger" 
                                onClick={() => deleteMessage(msg._id)}
                                title="Delete Message"
                              >
                                <FaTrash />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                      {messages.length === 0 && (
                        <tr>
                          <td colSpan="4" className="text-center py-5 opacity-50">
                            Your inbox is empty. No messages yet!
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
