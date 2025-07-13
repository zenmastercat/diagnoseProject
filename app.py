from flask import Flask, request, jsonify, send_from_directory
import numpy as np
import os

app = Flask(__name__, static_folder='static')

@app.route("/")
def index():
    return send_from_directory("static", "index.html")

@app.route("/predict", methods=["POST"])
def predict():
    data = request.get_json()
    features = np.array(data["features"])
    baseline = np.array(data["baseline"])

    def fix_length(arr):
        if len(arr) < 30:
            avg = np.mean(arr)
            return np.pad(arr, (0, 30 - len(arr)), constant_values=avg)
        return arr[:30]

    features = fix_length(features)
    baseline = fix_length(baseline)

    rmse = np.sqrt(np.mean((features - baseline) ** 2))
    print(f"RMSE: {rmse:.2f}")

    # Safer threshold: consider typing deviations in mobile, latency, etc.
    if rmse < 15:
        return jsonify({ "result": "✅ Normal Typing Pattern" })
    elif rmse < 25:
        return jsonify({ "result": "⚠️ Slight deviation detected. Consider retesting." })
    else:
        return jsonify({ "result": "⚠️ Possible Parkinson's Risk" })
        
return jsonify({
    "result": "✅ Normal Typing Pattern",
    "rmse": round(rmse, 2)
})


if __name__ == "__main__":
    port = int(os.environ.get('PORT', 5000))
    app.run(host="0.0.0.0", port=port)
