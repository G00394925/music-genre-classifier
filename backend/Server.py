from flask import Flask, request, send_from_directory, jsonify
from flask_cors import CORS
import numpy as np
import librosa 
import os
from Model import ModelTrainer

app = Flask(__name__)
CORS(app, resources={
    r"/api/*": {
        "origins": "*",
        "methods": ["GET", "POST", "PUT"],
        "allow_headers": ["Content-Type"]
    }
})

# Initialize model
trainer = ModelTrainer()
model = None
scaler = None

# Ensures model is only trained once
def init_model():
    global model, scaler
    try:
        model, scaler = trainer.train_model()
        print("Model has been trained")
    except Exception as e:
        print(str(e))

# Read the file
@app.route('/api/analyze', methods=['POST'])
def analyze():
    try:
        file = (request.files['user-track'])
        return jsonify(message = "Analyze endpoint works")    
    except Exception as e:
        return jsonify(message = str(e))

@app.errorhandler(404)
def not_found(e):
    return send_from_directory(app.static_folder, 'index.html')

# Start server
if __name__ == '__main__':
    init_model()
    app.run(debug = True)


