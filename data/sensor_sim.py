import random
import json
import time
import os

def generate_sensor_data():
    data = {
        "nitrogen": random.randint(10, 90),       # mg/kg
        "phosphorus": random.randint(5, 60),      # mg/kg
        "potassium": random.randint(20, 150),     # mg/kg
        "pH": round(random.uniform(5.5, 8.5), 2),  # ideal range
        "moisture": round(random.uniform(10, 70), 2),  # %
        "temperature": round(random.uniform(20, 40), 1),  # Celsius
        "co2": random.randint(350, 700)           # ppm
    }
    return data

def write_to_json(file_path):
    while True:
        data = generate_sensor_data()
        with open(file_path, 'w') as f:
            json.dump(data, f)
        print("Updated sensor data:", data)
        time.sleep(5)  # update every 5 seconds

if __name__ == "__main__":
    os.makedirs("data", exist_ok=True)
    write_to_json("data/sensor_data.json")