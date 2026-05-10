import ContactForm from "../components/ContactForm";

function Contact() {
  return (
    <section className="page-space">
      <div className="container">
        <h1 className="page-title text-center">
          Contact Me
        </h1>

        <p className="text-center text-light mt-3">
          Let’s build something amazing together.
        </p>

        <div className="mt-5">
          <ContactForm />
        </div>
      </div>
    </section>
  );
}

export default Contact;