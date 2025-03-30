import 'bootstrap/dist/css/bootstrap.min.css';
import './register.css';
import { useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import axios from 'axios';

const Register = () => {
    const [userName, setUserName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [repeatPass, setRepeatPass] = useState('');

    const navigate = useNavigate()

    // Verify that given email uses the correct format
    const validateEmail = (email) => {
        return String(email)
        .toLowerCase() // Convert email to lowercase
        .match(
            // Verify email format
            /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
        );
    }

    // Verify that account details are valid -- correct email, matching passwords
    const validateAccount = () => {
        if (!validateEmail(email)) {
            alert('Please enter a valid email address');
            return false;
        }

        if (password !== repeatPass) {
            alert('Passwords do not match');
            return false;
        }

        return true;
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (validateAccount()) {
            try {
                // Send user data to server and await on response from server
                const response = await axios.post('/api/create-account', {
                    username: userName,
                    email: email,
                    password: password
                }, {
                    headers: {
                        'Content-Type': 'application/json'
                    }
                })

                if(response.data.success) {
                    alert('Account created successfully')
                    navigate('/login')
                }
            } catch(error) {
                console.error("Registration error: ", error)
                alert(error.response?.data?.message || 'Registration failed');
            }
        }
    }

    return(
        <div>
            <form 
                onSubmit={handleSubmit} 
                className="card m-4 mx-auto login-styling" 
                style={{width: 400, padding: 25, backgroundColor: '#171717', color: 'white', borderRadius: '15px'}}>

                <div className="form-group">
                    <label>Username</label>
                    <input 
                        type="text" 
                        className="form-control" 
                        style={{backgroundColor: '#2b2b2b', color: 'white', borderColor: '#7F7F7F'}} 
                        value={userName}
                        required="true"
                        onChange={(e) => setUserName(e.target.value)} 
                    />
                </div>
                
                <div className="form-group">
                    <label>Email</label>
                    <input 
                        type="text" 
                        className="form-control" 
                        style={{backgroundColor: '#2b2b2b', color: 'white', borderColor: '#7F7F7F'}} 
                        value={email} 
                        required="true"
                        onChange={(e) => setEmail(e.target.value)} 
                    />
                </div>

                <div className="form-group">
                    <label>Password</label>
                    <input 
                        type="password" 
                        className="form-control" 
                        style={{backgroundColor: '#2b2b2b', color: 'white', borderColor: '#7F7F7F'}} 
                        value={password}
                        required="true" 
                        onChange={(e) => setPassword(e.target.value)} 
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="email">Repeat Password</label>
                    <input 
                        type="password" 
                        className="form-control" 
                        style={{backgroundColor: '#2b2b2b', color: 'white', borderColor: '#7F7F7F'}} 
                        value={repeatPass}
                        required="true" 
                        onChange={(e) => {
                            setRepeatPass(e.target.value);
                        }} 
                    />
                </div>

                <input id="submit-button" type="submit" value="Register"/>
                <label style={{ margin: '5px' }}>Already have an account? <a href="/login">Sign in here!</a></label>
            </form>

        </div>
    )
}

export default Register;