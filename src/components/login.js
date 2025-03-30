import 'bootstrap/dist/css/bootstrap.min.css';
import './register.css';
import { useState } from 'react';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [verifyPass, setVerifyPass] = useState(false);
    const [loggedin, setLoggedin] = useState(false);

    const validateEmail = (email) => {
        return String(email)
        .toLowerCase()
        .match(
            /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
        );
    }

    const validateAccount = () => {
        
    }

    return(
        <div>
            <form 
                // onSubmit={handleSubmit} 
                className="card m-4 mx-auto login-styling" 
                style={{width: 400, padding: 25, backgroundColor: '#171717', color: 'white', borderRadius: '15px'}}>

                <div className="form-group">
                    <label>Email</label>
                    <input 
                        type="text" 
                        className="form-control" 
                        style={{backgroundColor: '#2b2b2b', color: 'white', borderColor: '#7F7F7F'}} 
                        value={email} 
                        onChange={(e) => setEmail(e.target.value)} 
                    />
                </div>

                <div className="form-group">
                    <label>Password</label>
                    <input 
                        type="text" 
                        className="form-control" 
                        style={{backgroundColor: '#2b2b2b', color: 'white', borderColor: '#7F7F7F'}} 
                        value={password} 
                        onChange={(e) => setPassword(e.target.value)} 
                    />
                </div>

                <input id='submit-button' type='submit' value='Login' />
                <label style={{ margin: '5px' }}>Don't have an account? <a href="/register">Create one here!</a></label>
            </form>
        </div>
    )
}

export default Login;