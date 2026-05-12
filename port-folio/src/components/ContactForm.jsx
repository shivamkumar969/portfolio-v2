import { useRef, useState } from "react";
import emailjs from "@emailjs/browser";
import { FaUser, FaEnvelope, FaTag, FaCommentDots, FaPaperPlane } from "react-icons/fa";

function ContactForm() {
  const form = useRef();
  const [msg, setMsg] = useState("");
  const [isSending, setIsSending] = useState(false);

  const sendEmail = async (e) => {
    e.preventDefault();
    setIsSending(true);
    setMsg("Transmitting encrypted message...");

    const formData = new FormData(form.current);
    const data = {
      user_name: formData.get('user_name'),
      user_email: formData.get('user_email'),
      subject: formData.get('subject'),
      message: formData.get('message')
    };

    const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";
    const PUBLIC_KEY = "lyDWkAjAAkN_-LAuN";
    const SERVICE_ID = "service_njm2273";
    const TEMPLATE_ID = "template_x3je5me";
    const AUTO_REPLY_ID = "template_a86g9wo";

    try {
      // 1. Send Notification to Admin
      await emailjs.send(SERVICE_ID, TEMPLATE_ID, {
        name: data.user_name,
        email: data.user_email,
        title: data.subject,
        message: data.message,
      }, PUBLIC_KEY);

      // 2. Send Auto-Reply to User
      await emailjs.send(SERVICE_ID, AUTO_REPLY_ID, {
        name: data.user_name,
        email: data.user_email,
      }, PUBLIC_KEY);

      // 3. Save to Database (Server-side)
      await fetch(`${API_URL}/api/contact`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
      });

      setMsg("Message Transmitted Successfully! I will get back to you shortly. ✅");
      form.current.reset();
    } catch (error) {
      setMsg(`Transmission Failed: ${error.text || error.message} ❌`);
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="contact-form-wrapper max-w-2xl mx-auto px-2 px-md-0">
      <form ref={form} onSubmit={sendEmail} className="contact-form glass-card" style={{ padding: '32px 24px', borderRadius: '24px' }}>
        <div className="row g-4">

          {/* Name Input */}
          <div className="col-12 col-md-6">
            <div className="input-group-custom position-relative">
              <span className="position-absolute top-50 translate-middle-y ms-3 text-theme opacity-75" style={{ zIndex: 5 }}>
                <FaUser />
              </span>
              <input
                type="text"
                name="user_name"
                required
                className="form-control premium-input ps-5"
                placeholder="Your Name"
                style={{ height: '52px', borderRadius: '14px' }}
              />
            </div>
          </div>

          {/* Email Input */}
          <div className="col-12 col-md-6">
            <div className="input-group-custom position-relative">
              <span className="position-absolute top-50 translate-middle-y ms-3 text-theme opacity-75" style={{ zIndex: 5 }}>
                <FaEnvelope />
              </span>
              <input
                type="email"
                name="user_email"
                required
                className="form-control premium-input ps-5"
                placeholder="Your Email"
                style={{ height: '52px', borderRadius: '14px' }}
              />
            </div>
          </div>

          {/* Subject Input */}
          <div className="col-12">
            <div className="input-group-custom position-relative">
              <span className="position-absolute top-50 translate-middle-y ms-3 text-theme opacity-75" style={{ zIndex: 5 }}>
                <FaTag />
              </span>
              <input
                type="text"
                name="subject"
                required
                className="form-control premium-input ps-5"
                placeholder="Subject"
                style={{ height: '52px', borderRadius: '14px' }}
              />
            </div>
          </div>

          {/* Message Input */}
          <div className="col-12">
            <div className="input-group-custom position-relative">
              <span className="position-absolute ms-3 text-theme opacity-75" style={{ top: '18px', zIndex: 5 }}>
                <FaCommentDots />
              </span>
              <textarea
                rows="5"
                name="message"
                required
                className="form-control premium-input ps-5 pt-3"
                placeholder="Your Message..."
                style={{ borderRadius: '14px' }}
              ></textarea>
            </div>
          </div>

          {/* Submit Button */}
          <div className="col-12 mt-2">
            <button 
              className="btn btn-theme w-100 d-flex justify-content-center align-items-center gap-2 py-3 fw-bold shadow-lg" 
              style={{ borderRadius: '14px', fontSize: '1rem' }} 
              disabled={isSending}
            >
              <FaPaperPlane />
              {isSending ? "Transmitting..." : "Send Secure Message"}
            </button>
          </div>

          {/* Status Message */}
          {msg && (
            <div className="col-12 mt-3 text-center fw-medium small p-3 rounded-3 bg-dark text-info border border-info border-opacity-25 animate-fade">
              {msg}
            </div>
          )}

        </div>
      </form>
    </div>
  );
}

export default ContactForm;