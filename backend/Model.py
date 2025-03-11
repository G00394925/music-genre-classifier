from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import accuracy_score
import pandas as pd
import librosa


class Model():
    """This class is used to train the genre classification model.
    Initialized on server start.

    It reads a csv file of which contains the features
    and label of 1,000 royalty free music tracks. The data
    is split into training and testing sets before being scaled for
    accurate evaluation. The model is then trained using
    the Random Forest Classifier.

    Attributes:
        model: The trained model
        scaler: The feature scaler
    """

    # Constructor
    def __init__(self):
        """Model is initialized with an empty model and scaler."""
        self.model = None
        self.scaler = None

    # Train genre classification model
    def train_model(self):
        data = pd.read_csv('../data.csv')


        # Prepare fetures and labels
        X = data.drop(['filename', 'label'], axis=1)
        y = data['label']

        print(f"Training data shape: {X.shape}")
        print(f"Features used in training: {X.columns.tolist()}")
        # Split data into training and testing sets
        X_train, X_test, y_train, y_test = train_test_split(
            X, y, test_size=0.2)

        # Scale features
        self.scaler = StandardScaler()
        X_train_scaled = self.scaler.fit_transform(X_train)
        X_test_scaled = self.scaler.transform(X_test)

        # Train model
        self.model = RandomForestClassifier(
            n_estimators=100, random_state=42)

        self.model.fit(X_train_scaled, y_train)

        # Evaluate
        y_pred = self.model.predict(X_test_scaled)
        accuracy = accuracy_score(y_test, y_pred)

        print(f'Accuracy: {accuracy: .2f}')

        return self.model, self.scaler


    def predict_genre(self, file):

        y, sr = librosa.load(file, sr=None)

        # Initialize features array
        features = []

        # Extract tempo and beats        
        tempo, beats = librosa.beat.beat_track(y=y, sr=sr)
        features.append(float(tempo))
        features.append(int(len(beats)))

        # Extract spectral features
        chroma_stft = float(librosa.feature.chroma_stft(y=y, sr=sr).mean())
        features.append(chroma_stft)

        rmse = float(librosa.feature.rms(y=y).mean())
        features.append(rmse)

        spectral_centroid = float(librosa.feature.spectral_centroid(y=y, sr=sr).mean())
        features.append(spectral_centroid)

        spectral_bandwidth = float(librosa.feature.spectral_bandwidth(y=y, sr=sr).mean())
        features.append(spectral_bandwidth)

        rolloff = float(librosa.feature.spectral_rolloff(y=y, sr=sr).mean())
        features.append(rolloff)

        zero_crossing_rate = float(librosa.feature.zero_crossing_rate(y).mean())
        features.append(zero_crossing_rate)

        
        # MFCC (Mel-frequency cepstral coefficients)
        mfccs = librosa.feature.mfcc(y=y, sr=sr, n_mfcc=20)
        for i in range(20):
            features.append(float(mfccs[i].mean()))

        print(f"Number of features extracted: {len(features)}")
        print(f"Features array: {features}")
 

        # Scale features
        features_scaled = self.scaler.transform([features])

        # Predict the genre
        prediction = self.model.predict(features_scaled)

        return prediction[0]