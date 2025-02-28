import React, { useEffect, useState } from 'react';
import axios from 'axios';


const Home = () => {
    const [message, setMessage] = useState("")

    useEffect(() => {
        axios.get('/api/test')
            .then(response => {
                setMessage(response.data.message)
            })
            .catch(error => {
                console.error("Error: ", error)
            });
    }, []);

    return(
        <div id="home-div">
            <h1 id="home-heading">Define my Track</h1>
            <p id="home-body">Got a song you like? Well it's time to find out what exactly you're listening to. 
            Use our music genre classifier to figure out what it is that makes your song sound so special</p>
            <p>{message}</p>
        </div>     
    )
}

export default Home;