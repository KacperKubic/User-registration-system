import axios from "axios";
import { FC, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import '../styles/Login.css';

const Login:FC = () => {
    axios.defaults.withCredentials = true;

    const [username, setUsername] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [loginStatus, setLoginStatus] = useState<string>("");

    const login = (e: React.SyntheticEvent): void => {
        axios.post('http://localhost:3001/login', {
            username: username,
            password: password
        }).then((response) => {
           if(response.data.message){
            setLoginStatus(response.data.message)
           }else{
            setLoginStatus(response.data[0].username)
           }
        })
    }

    useEffect(() => {
        axios.get("http://localhost:3001/cookies").then((response) => {
            if(response.data.loggedIn === true){
                setLoginStatus(response.data.user)
            }
        })
    })

    return(
        <div className="loginPage">
            {loginStatus === "" ? (
                <div className="loginPageContent">
                    <div className="inputs">
                        <label>Username:</label>
                        <input type="text" onChange={(e: React.ChangeEvent<HTMLInputElement>) => {setUsername(e.target.value)}}/>
                        <label>Password:</label>
                        <input type="text" onChange={(e: React.ChangeEvent<HTMLInputElement>) => {setPassword(e.target.value)}}/>
                    </div>
                    <div className="options">
                        <button onClick={login}>Login</button>
                        <Link to='/register'>Doesn't have an account? Register</Link>
                    </div>
                </div>
            ) : (
                <div className="loginPageContent">
                    {loginStatus}
                </div>
            )}
        </div>
    )
}

export default Login;