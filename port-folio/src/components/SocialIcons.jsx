import { FaGithub, FaLinkedinIn, FaInstagram } from "react-icons/fa";

function SocialIcons() {
  return (
    <div className="d-flex gap-3 mt-4">
      <a href="#" style={{ color: 'var(--text-color)' }}><FaGithub size={22} /></a>
      <a href="#" style={{ color: 'var(--text-color)' }}><FaLinkedinIn size={22} /></a>
      <a href="#" style={{ color: 'var(--text-color)' }}><FaInstagram size={22} /></a>
    </div>
  );
}

export default SocialIcons;