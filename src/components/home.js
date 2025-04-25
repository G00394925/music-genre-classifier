import { useNavigate } from 'react-router-dom';
import { useAuth } from '../AuthProvider.js';
import './home.css'

const Home = () => {
    const { user } = useAuth(); // Get user from AuthProvider
    const navigate = useNavigate();
    const handleClick = () => {
        // Check if user is logged in
        // If user is logged in, navigate to analyze page
        // If user is not logged in, navigate to register page
        if (user) {  
            navigate('/analyze');
        } else {
            navigate('/register');
        }
    }

    return(
        <div id="home-div">
            <div id="welcome-message">
                <h1 id="home-heading">Define my Track</h1>
                <p id="home-body">Got a song you like? <br/> 
                Well it's time to find out what exactly you're listening to. <br/> 
                Use our music genre classifier to figure out what it is that makes your song sound so special</p>

                <button id="get-started-button" onClick={handleClick}>Get Started</button>
            </div>
            <div className="features-container">
                <div className='feature-card'>
                    <h3>Genre Detection</h3>
                    <hr/>
                    <p>Instantly classify the genre of your track</p>
                </div>
                <div className='feature-card'>
                    <h3>Audio Analysis</h3>
                    <hr/>
                    <p>Aquire insights about track features such as tempo and energy</p>
                </div>
                <div className='feature-card'>
                    <h3>Simple and Easy to use</h3>
                    <hr/>
                    <p>All you have to do is drag and drop your audio file to get started!</p>
                </div>
            </div>
        </div>     
    )
}

export default Home;