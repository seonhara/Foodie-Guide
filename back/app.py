from flask import Flask, jsonify, request
from flask_cors import CORS
import model

app = Flask(__name__)
CORS(app)  # Vite 프론트엔드와 CORS 문제 방지

@app.route('/api/hello')
def hello():
    return jsonify({"message": "Hello from Flask!"})

@app.route('/api/recommendations', methods=['POST'])
def recommendations():
    # 클라이언트가 보낸 JSON 데이터 읽기
    req_data = request.get_json()
    
    # "features" 키가 없으면 기본값 설정
    features = req_data.get("features", {})

    # model.py에서 추천 리스트 생성
    data = model.get_recommendations(features)
    print("print data", data)

    return jsonify(data)  # JSON 형식으로 반환


if __name__ == '__main__':
    app.run(debug=True)