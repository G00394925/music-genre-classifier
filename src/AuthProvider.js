import axios from "axios";
import { useContext, createContext, useState } from "react";
import { useNavigate } from "react-router-dom";

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(localStorage.getItem("site") || "")
    const navigate = useNavigate()

    const handleLogin = async (data) => {
        try{
            const response = await axios.post('http://localhost:5000/api/sign-in', 
                data, 
                {
                    headers: {
                        "Content-Type": "application/json"
                    }
                }
            );

            if (response.data) {
                setUser(response.data.user);
                setToken(response.token)
                localStorage.setItem("site", response.data.token)
                navigate("/analyze")
            }
        } catch(error) {
            console.error(error)
            throw error;
        }
    }

    const logOut = () => {
        setUser(null)
        setToken("")
        localStorage.removeItem("site")
        navigate("/login")
    }

    return <AuthContext.Provider value={{ token, user, handleLogin, logOut}}>{children}</AuthContext.Provider>
};

export default AuthProvider

export const useAuth = () => {
    return useContext(AuthContext)
}