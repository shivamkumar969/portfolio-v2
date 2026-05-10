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

    try {
      const res = await fetch(`${API_URL}/api/contact`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
      });

      if (res.ok) {
        setMsg("Message Sent Successfully! Check your email for confirmation ✅");
        form.current.reset();
      } else {
        setMsg("Failed to send message. Please try again ❌");
      }
    } catch (error) {
      setMsg("Failed to send message. Server offline ❌");
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