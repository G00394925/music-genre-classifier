from flask import Flask, request, send_from_directory, jsonify
from flask_cors import CORS
import numpy as np
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
    db = client['music_analyzer'] # Database name
    analyses = db['analyses'] # Collection name
    print("MongoDB connected")
except Exception as e:
    print("MongoDB connection error: ", str(e))


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

        return jsonify({
            "message": result["prediction"],
            "features": result["features"]
        })

    except Exception as e:
        return jsonify(message="Error: "+str(e))


@app.errorhandler(404)
def not_found(e):
    return send_from_directory(app.static_folder, 'index.html')

# Start server
if __name__ == '__main__':
    init_model()
    app.run(debug=True)
