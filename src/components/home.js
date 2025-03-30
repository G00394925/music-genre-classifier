import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import spectrogram from '../assets/spectrogram.jpg';

const Home = () => {
    const navigate = useNavigate();

    const handleClick = () => {
        navigate('/register');
    }

    return(
        <div id="home-div">
            <img className="spectrogram" src={spectrogram} alt="Spectrogram" />
            <h1 id="home-heading">Define my Track</h1>
            <p id="home-body">Got a song you like? <br/> 
            Well it's time to find out what exactly you're listening to. <br/> 
            Use our music genre classifier to figure out what it is that makes your song sound so special</p>
            <button id="get-started-button" onClick={handleClick}>Get Started</button>
        </div>     
    )
}

export default Home;