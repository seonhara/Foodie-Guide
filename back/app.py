from flask import Flask, jsonify, request, render_template
from flask_cors import CORS
import os
from dotenv import load_dotenv
import aiagent_model
load_dotenv() 

app = Flask(__name__)
app.secret_key = os.urandom(24) # 비밀 키 설정 (세션을 안전하게 사용하기 위해 필요)
CORS(app)  # Vite 프론트엔드와 CORS 문제 방지

# chatbot-llm 추가
@app.route("/api/aiagent", methods=["POST"])
def aiagent():
    user_message = request.json["message"]
    data = aiagent_model.chat(user_message)
    
    return jsonify(data)

if __name__ == '__main__':
    app.run(debug=True)