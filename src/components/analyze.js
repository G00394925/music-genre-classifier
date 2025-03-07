import './analyze.css'
import React, { useState } from 'react';
import Select from 'react-select';
import { FileUploader } from 'react-drag-drop-files';

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
    
    const allowedFiles = ["mp3", "wav"]
    const [file, setFile] = useState(null)
    
    const handleFile = (file) => {
        setFile(file)
    }
    

    return (
        <div id="main-div">
            <div id="grid-div">
                <div id="left-div">
                    <h2 style={{fontWeight: "bolder"}}>Options</h2>
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
                </div>

                <div id='right-div'>
                    <div id='upload-box'>
                        <FileUploader 
                            handleChange={handleFile}
                            types={allowedFiles}
                            style={{ height: '350px' }} />
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Analyze;