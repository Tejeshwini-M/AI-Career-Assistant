import { useState, useEffect } from "react";

function Chat() {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);

  // ✅ Load history
  useEffect(() => {
    const saved = localStorage.getItem("chatHistory");
    if (saved) setMessages(JSON.parse(saved));
  }, []);

  // ✅ Save history
  useEffect(() => {
    localStorage.setItem("chatHistory", JSON.stringify(messages));
  }, [messages]);

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

  // 🚀 Send message
  const send = async () => {
    if (!input.trim()) return;

    const userMsg = { text: input, type: "user" };
    const updated = [...messages, userMsg];

    setMessages(updated);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("http://127.0.0.1:5000/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          prompt: input
        })
      });

      const data = await res.json();

      const botMsg = { text: data.response, type: "bot" };

      setMessages([...updated, botMsg]);

      // 🔊 Speak response
      speak(data.response);

    } catch (err) {
      console.error(err);
      setMessages([
        ...updated,
        { text: "❌ Backend error", type: "bot" }
      ]);
    }

    setLoading(false);
  };

  return (
    <div className="chat-container">

      {/* 💬 Messages */}
      <div className="chat-box">
        {messages.map((msg, i) => (
          <div key={i} className={msg.type === "user" ? "user-msg" : "bot-msg"}>
            {msg.text}
          </div>
        ))}

        {loading && <div className="bot-msg">⏳ Typing...</div>}
      </div>

      {/* 🎤 Input Area */}
      <div className="chat-input">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask something..."
        />

        <button onClick={startVoice}>🎤 Speak</button>
<button onClick={stopVoice}>⏹ Stop</button>
        <button onClick={send}>Send</button>
      </div>
<button onClick={() => window.speechSynthesis.cancel()}>
  🔇 Stop
</button>
      {/* 🗑 Clear history */}
      <button
        style={{ marginTop: "10px" }}
        onClick={() => {
          localStorage.removeItem("chatHistory");
          setMessages([]);
        }}
      >
        🗑 Clear History
      </button>

    </div>
  );
}

export default Chat;