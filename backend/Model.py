from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import accuracy_score
import pandas as pd


class ModelTrainer():
    """This class is used to train the genre classification model. Initialized on server start.
    
    It reads a csv file of which contains the features and label of 1,000 royalty free
    music tracks. The data is split into training and testing sets before being scaled for
    accurate evaluation. The model is then trained using the Random Forest Classifier. 
    
    Attributes: 
        model: The trained model
        scaler: The feature scaler
    """    

    # Constructor
    def __init__(self):
        """ModelTrainer is initialized with an empty model and scaler."""
        self.model = None
        self.scaler = None
    
    # Train genre classification model
    def train_model(self):
        data = pd.read_csv('../data.csv')
        
        # Prepare fetures and labels
        X = data.drop(['filename', 'label'], axis = 1) 
        y = data['label'] 

        # Split data into training and testing sets
        X_train, X_test, y_train, y_test = train_test_split(X, y, test_size = 0.2)

        # Scale features
        self.scaler = StandardScaler()
        X_train_scaled = self.scaler.fit_transform(X_train)
        X_test_scaled = self.scaler.transform(X_test)

        # Train model
        self.model = RandomForestClassifier(n_estimators = 100, random_state = 42)
        self.model.fit(X_train_scaled, y_train)

        # Evaluate
        y_pred = self.model.predict(X_test_scaled)
        accuracy = accuracy_score(y_test, y_pred)

        print(f'Accuracy: {accuracy: .2f}')

        return self.model, self.scaler


class GenrePredictor():
    def __init__(self, model, scaler, file):
        self.model = model
        self.scaler = scaler
        self.file = file

    # TODO: Implement
    def predict_genre(self):
        return 0