import logo from './logo.svg';
import './App.css';
import Home from './components/home.js'
import NavBar from './components/NavBar.js'


function App() {
  return (
    <div>
      <NavBar />
      <div id='home-div'>
        <Home/>
      </div>
    </div>
  );
}

export default App;
