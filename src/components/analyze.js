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


const Analyze = () => {
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
            console.log(res)
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

                    <div id="info-container">
                        <Card id="info-card">
                            <Card.Title>
                                <MusicNoteIcon style={{ color: 'gold', width: '40px', height: '40px' }}/>
                                Tempo
                            </Card.Title>
                            <hr/>
                            <Card.Subtitle>
                                The speed at which a piece of music is played. 
                                It is measured in BPM (beats per minute).
                            </Card.Subtitle>
                        </Card>

                        <Card id="info-card">
                            <Card.Title>
                                <GraphicEqIcon style={{ color: 'gold', width: '40px', height: '40px' }}/>
                                Energy
                            </Card.Title>
                            <hr/>
                            <Card.Subtitle>
                                'Energy' describes the intensity and activity of a track.
                                It is measured on a scale of 0.0 to 1.0, where 1.0 would
                                be the most energetic and 0.0 the least.
                            </Card.Subtitle>
                        </Card>

                        <Card id="info-card">
                            <Card.Title>
                                <WaveformIcon style={{ color: 'gold', width: '40px', height: '40px' }}/>
                                Beats
                            </Card.Title>
                            <hr/>
                            <Card.Subtitle>
                                A "beat" represents the fundamental unit of time in music.
                                It is the pulse and rythm of the track. 
                            </Card.Subtitle>
                        </Card>
                    </div>
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
                                    }
                                }
                            }}
                            name="user-track"
                            labelIdle='Drag & Drop your track or <span class="filepond--label-action">Browse</span>' 
                            acceptedFileTypes={['audio/mpeg', 'audio/wav', 'audio/flac', 'audio/ogg', 'audio/mp3']}
                        />
                    </div>
    
                    {prediction && (
                        <div className="prediction-result">
                            <h3>Genre: <span style={{ color: 'gold' }}>{prediction.message}</span> </h3>
                        </div>
                    )}
                    
                    {prediction && (
                        
                        <div id="features-container">
                            <Card id="feature-card">
                                <MusicNoteIcon style={{ color: 'gold', width: '40px', height: '40px' }}/>
                                <Card.Title>Tempo</Card.Title>
                                <Card.Subtitle>{prediction.features.tempo} BPM </Card.Subtitle>
                            </Card>

                            <Card id="feature-card">
                                <GraphicEqIcon style={{ color: 'gold', width: '40px', height: '40px' }}/>
                                <Card.Title>Energy</Card.Title>
                                <Card.Subtitle>{prediction.features.energy}</Card.Subtitle>
                            </Card>

                            <Card id="feature-card">
                                <WaveformIcon style={{ color: 'gold', width: '40px', height: '40px' }}/>
                                <Card.Title>Beats</Card.Title>
                                <Card.Subtitle>{prediction.features.beats}</Card.Subtitle>
                            </Card>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

export default Analyze;


// Graph options array
// const options = [[ 
//     { value: 'surface_plot', label: '3D Surface Plot'},
//     { value: 'box_surface', label: '3D Box Surface'},
//     { value: 'histogram', label: '3D Histogram'}
// ],
// [
//     { value: 'blue', label: 'Blue'},
//     { value: 'lightblue', label: ' Light Blue'},
//     { value: 'purple', label: 'Purple'},
//     { value: 'pink', label: 'Pink'},
//     { value: 'yellow', label: 'Yellow'},
//     { value: 'orange', label: 'Orange'},
//     { value: 'black', label: 'Black'},
//     { value: 'red', label: 'Red'},
//     { value: 'lightgreen', label: 'Light Green'},
//     { value: 'green', label: 'Green'}
// ]];

// Set default values for options
// const [graphType, setGraphType] = useState(options[0][0].value)
// const [colour1, setColour1] = useState(options[1][0].value)
// const [colour2, setColour2] = useState(options[1][7].value)
// const [colour3, setColour3] = useState(options[1][9].value)

// // Apply settings
// const applySettings = (e) => {
//     e.preventDefault()
    
//     const settings = {graphType, colour1, colour2, colour3}
//     console.log(settings)
// }
                /* <div id="left-div">
                    <h2 style={{fontWeight: "bolder"}}>Options</h2>
                    <form onSubmit={applySettings}>
                        <div id="options-div">
                            <h5>Graph Type</h5>
                            <Select 
                                options={options[0]} 
                                value={options[0].find(opt => opt.value === graphType)} 
                                onChange={(option) => {setGraphType(option.value)}}/> <br />

                            <h5>Colour 1</h5>
                            <Select 
                                options={options[1]} 
                                value={options[1].find(opt => opt.value === colour1)} 
                                onChange={(option) => {setColour1(option.value)}}/> <br />

                            <h5>Colour 2</h5>
                            <Select 
                                options={options[1]} 
                                value={options[1].find(opt => opt.value === colour2)} 
                                onChange={(option) => {setColour2(option.value)}}/> <br />

                            <h5>Colour 3</h5>
                            <Select 
                                options={options[1]} 
                                value={options[1].find(opt => opt.value === colour3)} 
                                onChange={(option) => {setColour3(option.value)}}/> <br />
                        </div>

                        <button id='apply-btn'>Apply</button>    
                    </form>
                </div> */