from flask import Flask, request, send_from_directory, jsonify
from flask_cors import CORS
import pandas as pd
import numpy as np
import librosa 
import os

app = Flask(__name__)
CORS(app)

def printData():
    data = pd.read_csv('../data.csv')
    print(data.head()) # Print the first few rows of the data

# Test -- remove later
@app.route('/api/test')
def test():
    printData()
    return jsonify(message = 'Backend works') 

@app.errorhandler(404)
def not_found(e):
    return send_from_directory(app.static_folder, 'index.html')

if __name__ == '__main__':
    app.run(debug = True)
