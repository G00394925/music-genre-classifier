import './App.css';
import Home from './components/home.js'
import NavBar from './components/NavBar.js'
import Analyze from './components/analyze.js';
import History from './components/history.js';
import Register from './components/register.js';
import Login from './components/login.js';
import AuthProvider from './AuthProvider.js';
import 'bootstrap/dist/css/bootstrap.min.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

function App() {
  return (
    // <AuthProvider>
      <Router>
        <NavBar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/analyze" element={<Analyze />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/history" element={<History />} />
        </Routes>
      </Router>
//    </AuthProvider>
  );
}

export default App;
