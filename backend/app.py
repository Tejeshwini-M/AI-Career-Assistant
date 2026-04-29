from flask import Flask, request, jsonify
from flask_cors import CORS
import requests

app = Flask(__name__)
CORS(app)

# 🔥 Ollama function
def generate(prompt):
    try:
        res = requests.post(
            "http://localhost:11434/api/generate",
            json={
                "model": "phi",
                "prompt": prompt,
                "stream": False
            },
            timeout=30   # 👈 add this
        )
        return res.json()["response"]
    except Exception as e:
        print("Error:", e)
        return "⚠️ AI not responding"

# def generate(prompt):
#     return "✅ Working: " + prompt

# ✅ API route
@app.route("/generate", methods=["POST"])
def generate_api():
    data = request.json
    prompt = data.get("prompt")

    return jsonify({"response": generate(prompt)})

if __name__ == "__main__":
    app.run(debug=True)