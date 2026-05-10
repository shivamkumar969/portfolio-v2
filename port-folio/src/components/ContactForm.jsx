import { useRef, useState } from "react";
import emailjs from "@emailjs/browser";

function ContactForm() {
  const form = useRef();
  const [msg, setMsg] = useState("");

  const [isSending, setIsSending] = useState(false);

  const sendEmail = async (e) => {
    e.preventDefault();
    setIsSending(true);
    setMsg("Sending message...");

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
    const TEMPLATE_ID = "template_x3je5me"; // 👈 PASTE YOUR NEW TEMPLATE ID HERE

    try {
      // 1. Send Email via EmailJS
      await emailjs.send(SERVICE_ID, TEMPLATE_ID, {
        name: data.user_name,
        email: data.user_email,
        title: data.subject,
        message: data.message,
      }, PUBLIC_KEY);

      // 2. Save to Database (Server-side)
      await fetch(`${API_URL}/api/contact`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
      });

      setMsg("Message Sent Successfully! Check your email for confirmation ✅");
      form.current.reset();
    } catch (error) {
      setMsg(`Failed to send message: ${error.text || error.message} ❌`);
    } finally {
      setIsSending(false);
    }
  };

  return (
    <form ref={form} onSubmit={sendEmail} className="contact-form glass-card">
      <div className="row g-3">

        <div className="col-md-6">
          <input
            type="text"
            name="user_name"
            required
            className="form-control"
            placeholder="Your Name"
          />
        </div>

        <div className="col-md-6">
          <input
            type="email"
            name="user_email"
            required
            className="form-control"
            placeholder="Your Email"
          />
        </div>

        <div className="col-12">
          <input
            type="text"
            name="subject"
            required
            className="form-control"
            placeholder="Subject"
          />
        </div>

        <div className="col-12">
          <textarea
            rows="5"
            name="message"
            required
            className="form-control"
            placeholder="Message"
          ></textarea>
        </div>

        <div className="col-12">
          <button className="btn btn-theme" disabled={isSending}>
            {isSending ? "Sending..." : "Send Message"}
          </button>
        </div>

        {msg && (
          <div className="col-12 mt-2 text-info">
            {msg}
          </div>
        )}

      </div>
    </form>
  );
}

export default ContactForm;







// function ContactForm() {
//   return (
//     <form className="contact-form glass-card">
//       <div className="row g-3">

//         <div className="col-md-6">
//           <input
//             type="text"
//             className="form-control"
//             placeholder="Your Name"
//           />
//         </div>

//         <div className="col-md-6">
//           <input
//             type="email"
//             className="form-control"
//             placeholder="Your Email"
//           />
//         </div>

//         <div className="col-12">
//           <input
//             type="text"
//             className="form-control"
//             placeholder="Subject"
//           />
//         </div>

//         <div className="col-12">
//           <textarea
//             rows="5"
//             className="form-control"
//             placeholder="Message"
//           ></textarea>
//         </div>

//         <div className="col-12">
//           <button className="btn btn-theme">
//             Send Message
//           </button>
//         </div>

//       </div>
//     </form>
//   );
// }

// export default ContactForm;