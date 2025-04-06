import './analyze.css'
import React, { useState } from 'react';
import axios from 'axios';
import { FilePond } from 'react-filepond'; 
import 'filepond/dist/filepond.min.css'; // FilePond CSS styles
import 'font-awesome/css/font-awesome.min.css';
import AudioPlayer from './AudioPlayer';
import { Card } from 'react-bootstrap';
import MusicNoteIcon from '@mui/icons-material/MusicNote';
import TimerIcon from '@mui/icons-material/Timer';
import GraphicEqIcon from '@mui/icons-material/GraphicEq';
import WaveformIcon from '@mui/icons-material/Whatshot';
import { useAuth } from '../AuthProvider.js';

const Analyze = () => {
    const { user } = useAuth(); // Get user from AuthProvider
    const [file, setFile] = useState(null)
    const [isLoading, setIsLoading] = useState(false)
    const [prediction, setPrediction] = useState(null)

    const handleFile = (files) => {
        const file = files[0]?.file // Since FilePond returns an array of files, we take the first one
        setFile(file)
        setIsLoading(true) // Start loading bar

        // Send file to server for analysis
        axios.post('http://localhost:5000/api/analyze', file) 
        
        // Handle response
        .then(res => {
            console.log("Full response: ", res.data)
            console.log("Features: ", res.data.features)
            setPrediction(res.data)
            setIsLoading(false)
        })

        .catch(err => {
            console.log(err)
            setIsLoading(false)
        })
    }
    
    return (
        <div id="main-div">
            <div id="grid-div">
                <div id="left-div">
                    {/* Media Player */}
                    <AudioPlayer
                        audioFile={file}
                        prediction={prediction}
                    />
                </div>

                <div id='right-div'>
                    
                    {/* File upload */}
                    <div id='upload-box'>
                        <FilePond
                            value={file}
                            onupdatefiles={handleFile}
                            allowMultiple={false}
                            maxFiles={1}
                            server={{
                                url: '/api/analyze',
                                process: {
                                    method: 'POST',
                                    headers: {
                                        'Accept': 'application/json'
                                    },
                                    onload: (response) => {
                                        // Handle successful upload
                                        const result = JSON.parse(response)
                                        console.log('Upload complete:', JSON.parse(response));
                                        setPrediction(result);
                                    },
                                    onerror: (error) => {
                                        // Handle upload error
                                        console.error('Upload failed:', error);
                                    },
                                }
                            }}
                            name="user-track"
                            labelIdle='Drag & Drop your track or <span class="filepond--label-action">Browse</span>' 
                            acceptedFileTypes={['audio/mpeg', 'audio/wav', 'audio/flac', 'audio/ogg', 'audio/mp3']}
                        />
                    </div>
    
                    {/* Prediction label */}
                    {prediction && !isLoading && (
                        <div className="prediction-result-container">
                            <div className="prediction-result">
                                <h3>Genre: <span style={{ color: 'gold' }}>{prediction.message}</span> </h3>
                            </div>
                        </div>
                    )}
                    
                    {/* Features */}
                    {prediction && !isLoading && (
                        
                        <div id="features-container">
                            <Card id="feature-card">
                                <MusicNoteIcon style={{ color: 'gold', width: '40px', height: '40px' }}/>
                                <Card.Title>Tempo</Card.Title>
                                <Card.Subtitle>{prediction.features.tempo}</Card.Subtitle>
                                <p className="info-overlay">
                                    The speed at which a piece of music is played. 
                                    It is measured in BPM (beats per minute).
                                </p>
                            </Card>

                            <Card id="feature-card">
                                <GraphicEqIcon style={{ color: 'gold', width: '40px', height: '40px' }}/>
                                <Card.Title>Energy</Card.Title>
                                <Card.Subtitle>{prediction.features.energy}</Card.Subtitle>
                                <p className="info-overlay">
                                    'Energy' describes the intensity and activity of a track.
                                    It is measured on a scale of 0.0 to 1.0, where 1.0 would
                                    be the most energetic and 0.0 the least.
                                </p>
                            </Card>

                            <Card id="feature-card">
                                <WaveformIcon style={{ color: 'gold', width: '40px', height: '40px' }}/>
                                <Card.Title>Beats</Card.Title>
                                <Card.Subtitle>{prediction.features.beats}</Card.Subtitle>
                                <p className="info-overlay">
                                    A "beat" represents the fundamental unit of time in music.
                                    It is the pulse and rythm of the track.
                                </p> 
                            </Card>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

export default Analyze;