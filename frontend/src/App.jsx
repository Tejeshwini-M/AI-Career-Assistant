import { BrowserRouter, Routes, Route } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import Chat from "./components/Chat";
import Email from "./components/Email";
import Resume from "./components/Resume";
import LinkedIn from "./components/LinkedIn";
import Interview from "./components/Interview";
import "./index.css";

function App() {
  return (
    <BrowserRouter>
      <div className="app">
        <Sidebar />

        <div className="content">
          <Routes>
            <Route path="/" element={<Chat />} />
            <Route path="/email" element={<Email />} />
            <Route path="/resume" element={<Resume />} />
            <Route path="/linkedin" element={<LinkedIn />} />
            <Route path="/interview" element={<Interview />} />
          </Routes>
        </div>
      </div>
    </BrowserRouter>
  );
}

export default App;