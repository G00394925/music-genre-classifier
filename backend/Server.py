from flask import Flask, request, send_from_directory, jsonify
from flask_cors import CORS
import numpy as np
import datetime
import librosa
from pymongo import MongoClient
from dotenv import load_dotenv
from Model import Model
import os

# Load MongoDB connection URI from .env file
load_dotenv()

app = Flask(__name__)
CORS(app, resources={
    r"/api/*": {
        "origins": "*",
        "methods": ["GET", "POST", "PUT"],
        "allow_headers": ["Content-Type"]
    }
})

# MongoDB connection
try:
    client = MongoClient(os.getenv("MONGO_URI")) # MongoDB connection URI
    # db = client['music_analyzer'] # Database name
    # analyses = db['analyses'] # Collection name
    db = client['sample_analytics']
    collection = db['accounts']
    print("\033[92m" + "MongoDB connected" + "\033[0m")

    # DEBUG
    recent_entries = list(collection.find().limit(3))
    print("data: ")
    for entry in recent_entries:
        print(entry)
except Exception as e:
    print("\033[31m" + "MongoDB connection error: ", str(e) + "\033[0m")


# Initialize model
m = Model()
model = None
scaler = None


# Model is only trained once on server start
def init_model():
    global model, scaler
    try:
        model, scaler = m.train_model()
        print("Model has been trained")
        print(librosa.cite())

    except Exception as e:
        print(str(e))


# Read the file
@app.route('/api/analyze', methods=['POST'])
def analyze():
    try:
        file = (request.files['user-track'])
        result = m.predict_genre(file)

        # Save the analysis to MongoDB
        analysis_data = {
            "filename": file.filename,
            "prediction": result["prediction"],
            "features": result["features"],
            "timestamp": datetime.datetime.now()
        }
        analyses.insert_one(analysis_data)

        return jsonify({
            "message": result["prediction"],
            "features": result["features"]
        })

    except Exception as e:
        return jsonify(message="Error: "+str(e))

@app.route('/api/history', methods=['GET'])
def get_history():
    try:
        history = list(analyses.find(
            {},
            {'_id': 0}
        ).sort("timestamp", -1).limit(10))

        return jsonify(history)
    
    except Exception as e:
        return jsonify(message="Error: "+str(e))
    
@app.errorhandler(404)
def not_found(e):
    return send_from_directory(app.static_folder, 'index.html')

# Start server
if __name__ == '__main__':
    init_model()
    app.run(debug=True)
