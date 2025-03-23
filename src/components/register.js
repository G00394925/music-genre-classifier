import 'bootstrap/dist/css/bootstrap.min.css';
import { useState } from 'react';

const Register = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [userName, setUserName] = useState('');

    const validateEmail = (email) => {
        return String(email)
        .toLowerCase()
        .match(
            /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
        );
    }

    return(
        <div>
            <form 
                // onSubmit={handleSubmit} 
                className="card m-4 mx-auto login-styling bg-secondary" 
                style={{width: 400, padding: 25}}>
                
                <div className="form-group">
                    <label htmlFor="email">Email</label>
                    <input 
                        type="text" 
                        className="form-control" 
                        style={{backgroundColor: '#7F7F7F', color: 'white', borderColor: '#7F7F7F'}} 
                        value={email} 
                        onChange={(e) => setEmail(e.target.value)} 
                    />
                </div>
            </form>
        </div>
    )
}

export default Register;