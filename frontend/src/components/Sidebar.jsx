import { Link } from "react-router-dom";

function Sidebar() {
  return (
    <div className="sidebar">
      <h2>🚀 AI Assistant</h2>

      <Link to="/">💬 Chat</Link>
      <Link to="/email">📧 Email</Link>
      <Link to="/resume">📄 Resume</Link>
      <Link to="/linkedin">💼 LinkedIn</Link>
      <Link to="/interview">🎯 Interview</Link>
    </div>
  );
}

export default Sidebar;