from flask import Flask, jsonify, request, render_template
from flask_cors import CORS
import aiagentModel
import model
from dotenv import load_dotenv
load_dotenv() 

app = Flask(__name__)
CORS(app)  # Vite 프론트엔드와 CORS 문제 방지

# chatbot-llm 추가
# @app.route("/api/aiagent", methods=["POST"])
# def aiagent():
#     user_message = request.json["message"]
#     data = aiagentModel.chat(user_message)
#     
#     return jsonify(data)

@app.route("/api/aiagent", methods=["POST"])
def aiagent():
    user_message = request.json["message"]
    data = model.chat(user_message)  

    return jsonify(data)

if __name__ == '__main__':
    app.run(debug=True)