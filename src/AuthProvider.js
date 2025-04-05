import axios from "axios";
import { useContext, createContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(localStorage.getItem("site") || "")
    const navigate = useNavigate()

    useEffect(() => {
        const storedToken = localStorage.getItem("site");
        const storedUser = localStorage.getItem("user");

        if (storedToken === "logged-in" && storedUser) {
            setUser(JSON.parse(storedUser));
            setToken(storedToken);
        }
    }, [])

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

                const userData = { email: data.email};
                
                setUser(userData)
                setToken("logged-in")

                localStorage.setItem("site", "logged-in")
                localStorage.setItem("user", JSON.stringify(userData))

                // Redirect to the analyze page
                navigate("/analyze")

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
        localStorage.removeItem("user")
        console.log("Logged out")
        navigate("/")
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