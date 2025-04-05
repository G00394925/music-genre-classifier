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
            const response = await axios.post('/api/sign-in', data, {
                    headers: {
                        "Content-Type": "application/json"
                    }
                }
            );

            if (response.data.success) {
                console.log("Login successful")
                console.log(response.data)
                setUser({ email: data.email});

                localStorage.setItem("site", "logged-in")
                setToken("logged-in")

            } else {
                throw new Error(response.data.message)
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

    return (
        <AuthContext.Provider value={{ token, user, handleLogin, logOut}}>
            {children}
        </AuthContext.Provider>
)};

export default AuthProvider

export const useAuth = () => {
    return useContext(AuthContext)
}