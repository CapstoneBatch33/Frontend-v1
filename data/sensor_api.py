from flask import Flask, jsonify, request
from flask_cors import CORS
import json
import os

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

@app.route('/api/sensor-data', methods=['GET'])
def get_sensor_data():
    try:
        with open("data/sensor_data.json") as f:
            data = json.load(f)
        return jsonify(data)
    except FileNotFoundError:
        return jsonify({"error": "Sensor data not found"}), 404
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    os.makedirs("data", exist_ok=True)
    # Create initial data file if it doesn't exist
    if not os.path.exists("data/sensor_data.json"):
        with open("data/sensor_data.json", "w") as f:
            json.dump({
                "nitrogen": 50,
                "phosphorus": 30,
                "potassium": 80,
                "pH": 6.5,
                "moisture": 45,
                "temperature": 25,
                "co2": 450
            }, f)
    
    app.run(host='0.0.0.0', port=8080)