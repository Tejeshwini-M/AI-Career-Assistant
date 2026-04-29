import { useState, useEffect } from "react";

function Interview() {
  const [output, setOutput] = useState("");
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([]);
  const [score, setScore] = useState(null);

  // 🧠 Load history
  useEffect(() => {
    const saved = localStorage.getItem("interviewHistory");
    if (saved) setMessages(JSON.parse(saved));
  }, []);

  // 💾 Save history
  useEffect(() => {
    localStorage.setItem("interviewHistory", JSON.stringify(messages));
  }, [messages]);

  // 🎯 EXISTING FUNCTION (kept as you asked)
  const generate = async () => {
    const res = await fetch("http://127.0.0.1:5000/generate", {
      method: "POST",
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify({
        prompt: "Ask one HR interview question"
      })
    });

    const data = await res.json();
    setOutput(data.response);

    // also push into chat flow
    setMessages([{ text: data.response, type: "bot" }]);
  };

  // 🎤 Voice Input
const [recog, setRecog] = useState(null);

const startVoice = () => {
  const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();

  recognition.continuous = true;
  recognition.interimResults = true;

  setRecog(recognition);

  recognition.onresult = (event) => {
    let text = "";
    for (let i = 0; i < event.results.length; i++) {
      text += event.results[i][0].transcript;
    }
    setInput(text);
  };

  recognition.start();
};

const stopVoice = () => {
  if (recog) recog.stop();
};

  // 🔊 Voice Output
 const speak = (text) => {
  // stop any previous speech
  window.speechSynthesis.cancel();

  const speech = new SpeechSynthesisUtterance(text);
  speech.rate = 1;
  speech.pitch = 1;
  speech.lang = "en-US";

  window.speechSynthesis.speak(speech);
};

  // 📊 Submit Answer + Evaluation
  const submitAnswer = async () => {
    if (!input.trim()) return;

    const updated = [...messages, { text: input, type: "user" }];
    setMessages(updated);
    setInput("");

    const res = await fetch("http://127.0.0.1:5000/generate", {
      method: "POST",
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify({
        prompt: `
You are an HR interviewer.

User answer: ${input}

Give:
1. Score out of 10
2. Feedback
3. Corrected answer
4. Encouraging message
5. Next question

Format:
Score: X/10
Feedback:
Improved Answer:
Next Question:
`
      })
    });

    const data = await res.json();

    // extract score
    const match = data.response.match(/Score:\s*(\d+)/);
    if (match) setScore(match[1]);

    setMessages([
      ...updated,
      { text: data.response, type: "bot" }
    ]);

    // 🔊 Speak response
    speak(data.response);
  };

  // 🧾 Generate Report
  const generateReport = () => {
    const report = messages.map((m) => m.text).join("\n\n");
    const blob = new Blob([report], { type: "text/plain" });
    const link = document.createElement("a");

    link.href = URL.createObjectURL(blob);
    link.download = "interview_report.txt";
    link.click();
  };

 return (
  <div className="container">
    <h2>Interview Practice</h2>

    {/* Existing button */}
    <button onClick={generate}>Get Question</button>

    {/* Existing output */}
    <div className="output" style={{ whiteSpace: "pre-wrap" }}>
      {output}
    </div>

    <hr />

    {/* 💬 Chat Flow */}
    <div className="chat-box">
      {messages.map((msg, i) => (
        <div key={i} className={msg.type === "user" ? "user-msg" : "bot-msg"}>
          {msg.text}
        </div>
      ))}
    </div>

    {/* 🎤 Input + Buttons (FIXED ALIGNMENT) */}
    <div className="input-row">
      <input
        value={input}
        onChange={(e)=>setInput(e.target.value)}
        placeholder="Your answer..."
      />

      <button onClick={startVoice}>🎤 Speak</button>
<button onClick={stopVoice}>⏹ Stop</button>
      <button onClick={submitAnswer}>Submit</button>
    </div>
<button onClick={() => window.speechSynthesis.cancel()}>
  🔇 Stop
</button>
    {/* 📊 Score */}
    {score && <p className="score">⭐ Score: {score}/10</p>}

    {/* 🧾 Report + Clear */}
    <div className="action-row">
      <button onClick={generateReport}>📄 Download Report</button>

      <button
        className="secondary-btn"
        onClick={() => {
          localStorage.removeItem("interviewHistory");
          setMessages([]);
        }}
      >
        🗑 Clear History
      </button>
    </div>
  </div>
);
}

export default Interview;