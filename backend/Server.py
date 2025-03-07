from flask import Flask, request, send_from_directory, jsonify
from flask_cors import CORS
import numpy as np
import librosa 
import os
from Model import ModelTrainer

app = Flask(__name__)
CORS(app)

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

# Test -- remove later
@app.route('/api/home', methods=['GET'])
def test():
    try:
        if model is None:
            return jsonify(message = "Model not yet initialized")
        return jsonify(message = "Model ready")
    except Exception as e:
        return jsonify(message = str(e))

@app.errorhandler(404)
def not_found(e):
    return send_from_directory(app.static_folder, 'index.html')

# Start server
if __name__ == '__main__':
    init_model()
    app.run(debug = True)


