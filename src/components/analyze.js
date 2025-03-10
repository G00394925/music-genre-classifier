import './analyze.css'
import React, { useState } from 'react';
import Select from 'react-select';
import axios from 'axios';
import { FilePond } from 'react-filepond'; 
import 'filepond/dist/filepond.min.css'; // FilePond CSS styles

const Analyze = () => {
    
    const options = [[ 
        { value: '1', label: '3D Surface Plot'},
        { value: '2', label: '3D Box Surface'},
        { value: '3', label: '3D Histogram'}
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
                    <form>
                        <div id="options-div">
                            <h5>Graph Type</h5>
                            <Select options={options[0]} /> <br />

                            <h5>Colour 1</h5>
                            <Select options={options[1]} /> <br />

                            <h5>Colour 2</h5>
                            <Select options={options[1]} /> <br />

                            <h5>Colour 3</h5>
                            <Select options={options[1]} /> <br />
                        </div>

                        <button id='apply-btn'>Apply</button>    
                    </form>
                </div>

                <div id='right-div'>
                    <div id='upload-box'>
                        <h2 style={{fontWeight: "bolder"}}>Upload File</h2>
                        <FilePond
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
                        />
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Analyze;