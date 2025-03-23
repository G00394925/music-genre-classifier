import React, { useEffect, useState } from 'react';
import axios from 'axios';


const Home = () => {

    return(
        <div id="home-div">
            <h1 id="home-heading">Define my Track</h1>
            <p id="home-body">Got a song you like? <br/> 
            Well it's time to find out what exactly you're listening to. <br/> 
            Use our music genre classifier to figure out what it is that makes your song sound so special</p>
            <button id="home-button" className="btn btn-primary">Get Started</button>
        </div>     
    )
}

export default Home;