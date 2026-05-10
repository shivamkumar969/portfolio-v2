import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { FaTrash, FaPlus, FaLock, FaImage, FaEdit, FaTimes } from "react-icons/fa";

function Admin() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");

  const [projects, setProjects] = useState([]);
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
        
        <div className="d-flex justify-content-between align-items-center mb-5">
          <h2 className="section-title m-0">Admin Dashboard</h2>
          <button onClick={handleLogout} className="btn btn-outline-danger" style={{ borderRadius: '30px' }}>
            Logout
          </button>
        </div>
        
        <div className="row g-5">
          
          {/* Add/Edit Project Form */}
          <div className="col-lg-5">
            <motion.div 
              className="glass-card p-4"
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
            >
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
                        justifyContent: 'center',
                        transition: 'var(--transition)'
                      }}
                      onMouseOver={(e) => e.currentTarget.style.borderColor = 'var(--primary-color)'}
                      onMouseOut={(e) => e.currentTarget.style.borderColor = 'var(--border-color)'}
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
            </motion.div>
          </div>

          {/* Manage Projects Table */}
          <div className="col-lg-7">
            <motion.div 
              className="glass-card p-4"
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
            >
              <h4 className="mb-4">Manage Portfolio</h4>
              
              <div className="table-responsive mt-3">
                <table className="table table-borderless align-middle" style={{ '--bs-table-bg': 'transparent', color: 'var(--text-color)' }}>
                  <thead>
                    <tr style={{ borderBottom: '1px solid var(--border-color)' }}>
                      <th className="pb-3 text-uppercase" style={{ color: 'var(--text-light)', fontSize: '0.8rem', letterSpacing: '1px' }}>Preview</th>
                      <th className="pb-3 text-uppercase" style={{ color: 'var(--text-light)', fontSize: '0.8rem', letterSpacing: '1px' }}>Title</th>
                      <th className="pb-3 text-end text-uppercase" style={{ color: 'var(--text-light)', fontSize: '0.8rem', letterSpacing: '1px' }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {projects.map((project) => (
                      <tr key={project.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                        <td className="py-3">
                          <img 
                            src={project.image} 
                            alt={project.title} 
                            style={{ 
                              width: '60px', 
                              height: '45px', 
                              objectFit: 'cover', 
                              borderRadius: '8px',
                              boxShadow: '0 4px 10px rgba(0,0,0,0.2)' 
                            }} 
                          />
                        </td>
                        <td className="py-3 fw-bold">{project.title}</td>
                        <td className="py-3 text-end">
                          <div className="d-flex justify-content-end gap-2">
                            <button 
                              className="btn btn-sm"
                              style={{ backgroundColor: 'rgba(6, 182, 212, 0.1)', color: '#06b6d4', border: '1px solid rgba(6, 182, 212, 0.2)' }}
                              onClick={() => handleEditClick(project)}
                              title="Edit Project"
                            >
                              <FaEdit />
                            </button>
                            <button 
                              className="btn btn-sm"
                              style={{ backgroundColor: 'rgba(239, 68, 68, 0.1)', color: '#ef4444', border: '1px solid rgba(239, 68, 68, 0.2)' }}
                              onClick={() => handleDelete(project.id)}
                              title="Delete Project"
                            >
                              <FaTrash />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                    {projects.length === 0 && (
                      <tr>
                        <td colSpan="3" className="text-center py-5 text-light">
                          No projects uploaded yet. Start adding some!
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </motion.div>
          </div>

        </div>
      </div>
    </section>
  );
}

export default Admin;
