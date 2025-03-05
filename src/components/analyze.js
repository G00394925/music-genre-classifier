import './analyze.css'
import React, { useState } from 'react';
import Select from 'react-select';

const Analyze = () => {

    const options = [[ 
        { value: '1', label: 'Graph 1'},
        { value: '2', label: 'Graph 2'},
        { value: '3', label: 'Graph 3'}
    ],
    [
        { value: 'blue', label: 'Blue'},
        { value: 'red', label: 'Red'},
        { value: 'green', label: 'Green'}
    ]];

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
                </div>
            </div>
        </div>
    )
}

export default Analyze;