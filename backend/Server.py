"""
Flask server for the Music Genre Classifier app.

This is a server that provides API endpoints for
1. Analyzing a music track
2. Retrieving the analysis history from a database
3. User Authentication (registration, login)

Upon startup, the server connects to a MongoDB database of which
stores the analysis history and registered users.

It then initializes a machine learning model that is used to
analyze the music tracks.

Dependencies:
- Flask, Flask-CORS
- MongoDB
- librosa
- Model class



"""

from flask import Flask, request, send_from_directory, jsonify
from flask_cors import CORS
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
    client = MongoClient(os.getenv("MONGO_URI"))  # MongoDB connection URI
    db = client['music_analyzer']  # Database name
    analyses = db['analyses']  # Analyses collection
    users = db['users']  # Registered users collection
    print("\033[92m" + "MongoDB connected" + "\033[0m")
except Exception as e:
    print("\033[31m" + "MongoDB connection error: ", str(e) + "\033[0m")


# Initialize model
m = Model()
model = None
scaler = None


# Model is only trained once on server start
def init_model():
    """

    Initialize the model and scaler.
    Called on server startup.
    
    """
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
    """
    Analyze the uploaded music track and return the genre prediction.
    Calls the predict_genre method from the Model class, where the
    results are then added to a MongoDB database and returned.

    Returns:
        JSON response with the predicted genre and features.
        - success (bool): True if account was created successfully
        - message (str): Message with more details
    """
    try:
        file = (request.files['user-track'])
        result = m.predict_genre(file)
        print(f"User: {request.form.get('user_id')}")

        # Set the analysis data
        analysis_data = {
            "filename": file.filename,
            "prediction": result["prediction"],
            "features": result["features"],
            "timestamp": datetime.datetime.now()
        }
        analyses.insert_one(analysis_data)  # Insert analysis data into MongoDB

        return jsonify({
            "message": result["prediction"],
            "features": result["features"]
        })

    except Exception as e:
        return jsonify(message="Error: "+str(e))


# Retrieve analysis history from database
@app.route('/api/history', methods=['GET'])
def get_history():
    """
    Retrives the analysis history from the database.

    Returns:
        JSON response with all analysis history.
        - success (bool): True if account was created successfully
        - message (str): Message with more details
    """
    try:
        history = list(analyses.find(
            {},  # All documents
            {'_id': 0}  # Exclude id field
        ).sort("timestamp", -1).limit(10))  # Sorted by timestamp, descending

        return jsonify(history)

    except Exception as e:
        return jsonify(message="Error: "+str(e))


# Delete analysis history
@app.route('/api/history', methods=['DELETE'])
def delete_history():
    """
    Deletes all entries in the analysis history.

    Returns: 
        JSON response with success message.
        - success (bool): True if account was created successfully
        - message (str): Message with more details
    """
    try:
        analyses.delete_many({})  # Delete all entries
        return jsonify({
            "success": True,
            "message": "History has been cleared"})
    except Exception as e:
        return str(e)


# Create user account
@app.route('/api/create-account', methods=['POST'])
def create_account():
    """
    Creates a new user account. Requests the details from the client 
    and then checks whether the email already exists or not. If it can't
    find the email it proceeds to store the new user into the database.

    Returns:
        JSON response with status message.
        - success (bool): True if account was created successfully
        - message (str): Message with more details
    """
    try:
        user = request.get_json()

        existing_user = users.find_one({'email': user['email']})
        if existing_user:
            print(f"Email already registered: {user['email']}")
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
        print(f"Registration error: {str(e)}")
        return jsonify({
            'success': False,
            'message': str(e)
        }), 500


# Sign user into application
@app.route('/api/sign-in', methods=['POST'])
def sign_in():
    """
    Signs user into their account if it exists. 
    Will request the details from the client and checks if they exist
    in the database, in which case it will return a success message and
    sign the user in.
    
    Returns:
        JSON response with status message.
        - success: True if account was signed in
        - message: Message with more details
    """
    try:
        user_creds = request.get_json()  # Get user credentials from request
        
        # Check if user exists in database
        existing_user = users.find_one({
            'email': user_creds['email'],
            'password': user_creds['password']
        })  
        
        # User exists
        if existing_user:  
            return jsonify({
                'success': True,
                'message': 'Logging in. . .'
            })
        
        # User does not exist
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
