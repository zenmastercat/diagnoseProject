from flask import Flask, request, jsonify, send_from_directory
import numpy as np
import pickle
import os

app = Flask(__name__, static_folder='static')

model = pickle.load(open("model.pkl", "rb"))





@app.route("/")
def index():
    return send_from_directory("static", "index.html")

@app.route("/predict", methods=["POST"])
def predict():
    data = request.get_json()
    print("Received data:", data)
    features = np.array(data["features"]).reshape(1, -1)

    if features.shape[1] < 30:
        avg = np.mean(features)
        features = np.pad(features, ((0, 0), (0, 30 - features.shape[1])), constant_values=avg)
    elif features.shape[1] > 30:
        features = features[:, :30]

    result = model.predict(features)[0]
    return jsonify({ "result": "Possible Parkinson's Risk" if result == 1 else "Normal" })

if __name__ == "__main__":
    port = int(os.environ.get('PORT', 5000))
    app.run(host="0.0.0.0", port=port)
