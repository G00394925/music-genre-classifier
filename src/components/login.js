import 'bootstrap/dist/css/bootstrap.min.css';
import './register.css';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios'; 

const Login = () => {
    const [user, setUser] = useState({
        email: '',
        password: ''
    });

    const navigate = useNavigate()

    const handleInput = (e) => {
        const { name, value } = e.target;
        setUser((prev) => ({
          ...prev,
          [name]: value,
        }));
      }

    const handleSubmit = async (e) => {
        e.preventDefault()

        // try{
        //     const response = await axios.post('/api/sign-in', {
        //         email: email,
        //         password: password
        //     })
    
        //     if (response.data.success) {
        //         setLoggedin(true)
        //         navigate('/analyze')
        //     } 

        // } catch(error) {
        //     console.error("Login error: ", error)
        //     alert(error.response?.data?.message || 'Login failed');
        // }
    }

    return(
        <div>
            <form 
                onSubmit={handleSubmit} 
                className="card m-4 mx-auto login-styling" 
                style={{width: 400, padding: 25, backgroundColor: '#171717', color: 'white', borderRadius: '15px'}}>

                <div className="form-group">
                    <label>Email</label>
                    <input 
                        type="email" 
                        className="form-control" 
                        style={{backgroundColor: '#2b2b2b', color: 'white', borderColor: '#7F7F7F'}} 
                        name="email"
                        required="true"
                        onChange={(e) => handleInput(e.target.value)} 
                    />
                </div>

                <div className="form-group">
                    <label>Password</label>
                    <input 
                        type="password" 
                        className="form-control" 
                        style={{backgroundColor: '#2b2b2b', color: 'white', borderColor: '#7F7F7F'}} 
                        name="password"
                        required="true"
                        onChange={(e) => handleInput(e.target.value)} 
                    />
                </div>

                <input id='submit-button' type='submit' value='Login' />
                <label style={{ margin: '5px' }}>Don't have an account? <a href="/register">Create one here!</a></label>
            </form>
        </div>
    )
}

export default Login;