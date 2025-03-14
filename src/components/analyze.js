import './analyze.css'
import React, { useState } from 'react';
import Select from 'react-select';
import axios from 'axios';
import { FilePond } from 'react-filepond'; 
import 'filepond/dist/filepond.min.css'; // FilePond CSS styles

const Analyze = () => {
    
    // Graph options array
    const options = [[ 
        { value: 'surface_plot', label: '3D Surface Plot'},
        { value: 'box_surface', label: '3D Box Surface'},
        { value: 'histogram', label: '3D Histogram'}
    ],
    [
        { value: 'blue', label: 'Blue'},
        { value: 'lightblue', label: ' Light Blue'},
        { value: 'purple', label: 'Purple'},
        { value: 'pink', label: 'Pink'},
        { value: 'yellow', label: 'Yellow'},
        { value: 'orange', label: 'Orange'},
        { value: 'black', label: 'Black'},
        { value: 'red', label: 'Red'},
        { value: 'lightgreen', label: 'Light Green'},
        { value: 'green', label: 'Green'}
    ]];

    // Set default values for options
    const [graphType, setGraphType] = useState(options[0][0].value)
    const [colour1, setColour1] = useState(options[1][0].value)
    const [colour2, setColour2] = useState(options[1][7].value)
    const [colour3, setColour3] = useState(options[1][9].value)
    
    // Apply settings
    const applySettings = (e) => {
        e.preventDefault()
        
        const settings = {graphType, colour1, colour2, colour3}
        console.log(settings)
    }

    const [file, setFile] = useState(null)    

    const handleFile = (file) => {
        setFile(file)
        axios.post('http://localhost:5000/api/analyze', file) 
            .then(res => {
                console.log(res)
            })
            .catch(err => {
                console.log(err)
            })
    }

    return (
        <div id="main-div">
            <div id="grid-div">
                <div id="left-div">
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
                </div>

                <div id='right-div'>
                    <div id='upload-box'>
                        <h2 style={{fontWeight: "bolder"}}>Upload File</h2>
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
                                        console.log('Upload complete:', JSON.parse(response));
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
                </div>
            </div>
        </div>
    )
}

export default Analyze;