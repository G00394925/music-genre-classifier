"""

DATASET USED: GTZAN dataset

@misc{tzanetakis_essl_cook_2001,
author    = "Tzanetakis, George and Essl, Georg and Cook, Perry",
title     = "Automatic Musical Genre Classification Of Audio Signals",
url       = "http://ismir2001.ismir.net/pdf/tzanetakis.pdf",
publisher = "The International Society for Music Information Retrieval",
year      = "2001"
}

"""

from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import accuracy_score
import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
import base64
from io import BytesIO
import librosa
import librosa.display


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
        """
        Data is read from a csv file and then split into training
        and testing sets.

        Returns:
            model: The trained model
            scaler: The feature scaler
        """

        data = pd.read_csv('../data.csv')

        global accuracy

        # Remove unnecessary columns
        X = data.drop(['filename', 'label'], axis = 1) # Features
        y = data['label'] # Target variable (genre)

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

    # Predict genre of user uploaded track
    def predict_genre(self, file):
        """
        Reads the user uploaded audio file, and extracts features 
        from the track. The features are scaled and used to 
        predict the genre. Among those features include a few graphical
        representations of the track, being a waveform, spectrogram and
        chromagram. These are then converted to base64-encoded strings
        to be embedded in HTML.

        The features extracted are:
        - Tempo
        - Beats
        - Short-time Fourier transform (STFT)
        - Root Mean Square Energy (RMSE)
        - Spectral Centroid
        - Spectral Bandwidth
        - Spectral Rolloff
        - Zero Crossing Rate
        - Mel-frequency cepstral coefficients (MFCC)
        - Duration
        - Waveform
        - Spectrogram
        - Chromagram

        Args:
            file: The user-uploaded audio file

        Returns:
            prediction: The predicted genre
            features: The extracted features
        """

        # Load the audio file
        # y = audio time series -- a numpy array of the raw audio data
        # sr = sampling rate -- represents the number of data points sampled per second
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

        # Root Mean Square Energy (RMSE) -- A measure of the "energy" or loudness of the audio signal
        rmse = float(librosa.feature.rms(y=y).mean())
        features.append(rmse)

        # Spectral centroid -- indicates whether the sound contains more high or low frequencies
        spectral_centroid = float(librosa.feature.spectral_centroid(y=y, sr=sr).mean())
        features.append(spectral_centroid)

        # Spectral bandwidth -- measures the width of the range of frequencies in the sound
        spectral_bandwidth = float(librosa.feature.spectral_bandwidth(y=y, sr=sr).mean())
        features.append(spectral_bandwidth)

        # Spectral rolloff -- Distinguishes between harmonic and non-harmonic content
        rolloff = float(librosa.feature.spectral_rolloff(y=y, sr=sr).mean())
        features.append(rolloff)

        # Zero crossing rate -- The rate at which the audio signal crosses the zero amplitude line
        # (changes from positive to negative or vice versa). Higher for noisy/percussive sounds.
        zero_crossing_rate = float(librosa.feature.zero_crossing_rate(y).mean())
        features.append(zero_crossing_rate)

        # MFCC (Mel-frequency cepstral coefficients) -- These are audio features used in music
        # and speech recognition. They represent the short-term power spectrum of sound.
        mfccs = librosa.feature.mfcc(y=y, sr=sr, n_mfcc=20)
        for i in range(20):
            features.append(float(mfccs[i].mean()))

        # Scale features
        features_scaled = self.scaler.transform([features])

        # Predict the genre
        prediction = self.model.predict(features_scaled)

        # Get track duration
        duration = librosa.get_duration(y=y, sr=sr) 

        # Get a waveform image of the track
        plt.figure(figsize=(10, 5))
        librosa.display.waveshow(y, sr=sr, color='gold')
        
        # Remove axis, borders and other elements -- only the waveform is wanted
        plt.axis('off')
        plt.xticks([])
        plt.yticks([])
        plt.margins(0, 0)
        plt.tight_layout(pad=0)
        plt.subplots_adjust(left=0, right=1, top=1, bottom=0, hspace=0, wspace=0)

        # Convert to base64-encoded string -- allows image to be embedded in HTML
        wave_buffer = BytesIO()
        plt.savefig(wave_buffer, format='png', bbox_inches='tight', pad_inches=0, transparent=True)
        wave_buffer.seek(0)
        waveform_img = base64.b64encode(wave_buffer.getvalue()).decode('utf-8')
        plt.close()  # Close the plot to free memory

        # Get a spectrogram image of the track & remove elements as before
        plt.figure(figsize=(10, 5))
        D = librosa.amplitude_to_db(np.abs(librosa.stft(y)), ref=np.max)
        librosa.display.specshow(D, sr=sr, x_axis='time', y_axis='log')
        plt.axis('off')
        plt.xticks([])
        plt.yticks([])
        plt.margins(0, 0)
        plt.tight_layout(pad=0)
        plt.subplots_adjust(left=0, right=1, top=1, bottom=0, hspace=0, wspace=0)

        spec_buffer = BytesIO()
        plt.savefig(spec_buffer, format='png', bbox_inches='tight', pad_inches=0, transparent=True)
        spec_buffer.seek(0)
        spectrogram_img = base64.b64encode(spec_buffer.getvalue()).decode('utf-8')
        plt.close()

        # Get a chromagram image of the track
        plt.figure(figsize=(10, 5))
        chroma = librosa.feature.chroma_cqt(y=y, sr=sr)
        librosa.display.specshow(chroma, x_axis='time', y_axis='chroma')
        plt.axis('off')
        plt.xticks([])
        plt.yticks([])
        plt.margins(0, 0)
        plt.tight_layout(pad=0)
        plt.subplots_adjust(left=0, right=1, top=1, bottom=0, hspace=0, wspace=0)

        chroma_buffer = BytesIO()
        plt.savefig(chroma_buffer, format='png', bbox_inches='tight', pad_inches=0, transparent=True)
        chroma_buffer.seek(0)
        chroma_img = base64.b64encode(chroma_buffer.getvalue()).decode('utf-8')
        plt.close()


        return {
            "prediction": prediction[0],
            "features": {
                "tempo": round(float(tempo), 1),
                "energy": round(float(rmse), 3),
                "beats": int(len(beats)),
                "duration": round(duration, 2),
                "waveform_img": f"data:image/png;base64,{waveform_img}",
                "spectrogram_img": f"data:image/png;base64,{spectrogram_img}",
                "chroma_img": f"data:image/png;base64,{chroma_img}"
            },
            "accuracy": accuracy
        }
