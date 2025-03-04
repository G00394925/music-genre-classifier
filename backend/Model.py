from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import accuracy_score
import pandas as pd


class ModelTrainer():
    
    # Constructor
    def __init__(self):
        self.model = None
        self.scaler = None
    
    # Train genre classification model
    def trainModel(self):
        data = pd.read_csv('../data.csv')
        
        # Remove unnecessary columns
        X = data.drop(['filename', 'label'], axis = 1) # Features
        y = data['label'] # Target variable (genre)

        # Split data into training and testing sets
        X_train, X_test, y_train, y_test = train_test_split(X, y, test_size = 0.2)

        # Implement feature scaling
        self.scaler = StandardScaler()
        X_train_scaled = self.scaler.fit_transform(X_train)
        X_test_scaled = self.scaler.transform(X_test)

        # Train the model
        self.model = RandomForestClassifier(n_estimators = 100, random_state = 42)
        self.model.fit(X_train_scaled, y_train)

        # Predict & Evaluate
        y_pred = self.model.predict(X_test_scaled)
        accuracy = accuracy_score(y_test, y_pred)

        print(f'Accuracy: {accuracy: .2f}')

        return self.model, self.scaler
