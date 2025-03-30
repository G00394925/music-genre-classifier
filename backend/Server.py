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
    db = client['music_analyzer'] # Database name
    analyses = db['analyses'] # Analyses collection
    users = db['users'] # Registered users collection
    print("\033[92m" + "MongoDB connected" + "\033[0m")
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
            {}, # All documents
            {'_id': 0} # Exclude id field
        ).sort("timestamp", -1).limit(10)) # Sorted by timestamp, descending

        return jsonify(history)
    
    except Exception as e:
        return jsonify(message="Error: "+str(e))
    
@app.route('/api/create-account', methods=['POST'])
def create_account():
    try:
        user = request.get_json()

        # Check if user already exists in database
        existing_user = user.find_one({'email': user['email']})
        if existing_user:
            return jsonify({
                'success': False,
                'message': 'Email already registered'
            }), 400

        user_data = {
            "username": user['username'],
            "email": user['email'],
            "password": user['password']
        }

        users.insert_one(user_data)

        return jsonify({
            'success': True,
            'message': 'Account created successfully'
        })
    except Exception as e:
        print(str(e))

@app.route('/api/sign-in', methods=['GET'])
def get_account():
    try:
        user_creds = request.get_json()

        existing_user = users.find_one({'email': user_creds['email']})
        if existing_user:
            return jsonify({
                'success': True,
                'message': 'Logging in. . .'
            })
        else:
            return jsonify({
                'success': False,
                'message': 'Incorrect credentials'
            })
    except Exception as e:
        return jsonify({
            'success': False,
            'message': str(e)
        })


@app.errorhandler(404)
def not_found(e):
    return send_from_directory(app.static_folder, 'index.html')

# Start server
if __name__ == '__main__':
    init_model()
    app.run(debug=True)
