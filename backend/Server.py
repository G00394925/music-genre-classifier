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
def initModel():
    global model, scaler
    try:
        model, scaler = trainer.trainModel()
        print("Model has been trained")
    except Exception as e:
        print(str(e))

# Test -- remove later
@app.route('/api/test', methods = ['GET'])
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

if __name__ == '__main__':
    initModel()
    app.run(debug = True)


