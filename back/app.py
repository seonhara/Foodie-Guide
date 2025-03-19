from flask import Flask, jsonify, request, render_template
from flask_cors import CORS
import model
import langchainModel

app = Flask(__name__)
CORS(app)  # Vite 프론트엔드와 CORS 문제 방지

@app.route('/api/hello')
def hello():
    return jsonify({"message": "Hello from Flask!"})

# @app.route('/api/test', methods=('GET', 'POST'))
# def test():
#     if request.method=='POST':
#         uparam = request.form['user']
#     elif request.method=='GET':
#         uparam = request.args['user']
#         return render_template('home.html', user=uparam, data={'leve': 2, 'point': 30})

@app.route('/api/recommendations', methods=['POST'])
def recommendations():
    req_data = request.get_json()
    
    user_message = req_data.get("text", {})
    data = model.get_recommendations(user_message)
    return jsonify(data)

@app.route('/api/langchain', methods=['POST'])
def langchain():
    req_data = request.get_json()
    
    user_message = req_data.get("text", {})
    data = langchainModel.get_messages(user_message)
    return jsonify(data)


if __name__ == '__main__':
    app.run(debug=True)