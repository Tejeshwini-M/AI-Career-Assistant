import { useState } from "react";

function LinkedIn() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState(false);

  const generate = async () => {
    setLoading(true);

    const res = await fetch("http://127.0.0.1:5000/generate", {
      method: "POST",
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify({
        prompt: `Write a LinkedIn post:\n${input}`
      })
    });

    const data = await res.json();
    setOutput(data.response);
    setLoading(false);
  };

  return (
    <div className="page-card">
      <h2>📧 LinkedIn Post Generator</h2>

      <textarea
        placeholder="Enter details (role, company, purpose...)"
        value={input}
        onChange={(e) => setInput(e.target.value)}
      />

      <button onClick={generate}>Generate</button>

      {loading && <p className="loading">⏳ Generating...</p>}

      <div className="output-box" style={{ whiteSpace: "pre-wrap" }}>
        {output || "Your generated LinkedIn post will appear here..."}
      </div>
    </div>
  );
}

export default LinkedIn;