from flask import Flask, request, send_from_directory, jsonify
from flask_cors import CORS
import pandas as pd
import numpy as np
import librosa 
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import accuracy_score
import os

app = Flask(__name__)
CORS(app)

# Train genre classification model
def trainModel():
    data = pd.read_csv('../data.csv')
    
    # Remove unnecessary columns
    X = data.drop(['filename', 'label'], axis = 1)
    y = data['label'] # Target variable (genre)

    # Split data into training and testing sets
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size = 0.2)

    # Implement feature scaling
    scaler = StandardScaler()
    X_train_scaled = scaler.fit_transform(X_train)
    X_test_scaled = scaler.transform(X_test)

    # Train the model
    model = RandomForestClassifier(n_estimators = 100, random_state = 42)
    model.fit(X_train_scaled, y_train)

    # Predict & Evaluate
    y_pred = model.predict(X_test_scaled)
    accuracy = accuracy_score(y_test, y_pred)

    print(f'Accuracy: {accuracy: .2f}')

    return model, scaler


# Test -- remove later
@app.route('/api/test')
def test():
    try:
        model, scaler = trainModel()
        return jsonify(message = "Model has been trained")
    except Exception as e:
        return jsonify(message = str(e))

@app.errorhandler(404)
def not_found(e):
    return send_from_directory(app.static_folder, 'index.html')

if __name__ == '__main__':
    app.run(debug = True)


