import axios from "axios";
import { FC, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import '../styles/Login.css';

interface User{
    username: string;
}

const Login:FC = () => {
    axios.defaults.withCredentials = true;

    const [username, setUsername] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [loginStatus, setLoginStatus] = useState<boolean>(false);
    const [loginMessage, setLoginMessage] = useState<string>("");
    const [loggedUser, setLoggedUser] = useState<string>("");
    const [userList, setUserList] = useState<Array<User>>([]);

    //Send post request to backend
    const login = (e: React.SyntheticEvent): void => {
        axios.post('http://localhost:3001/login', {
            username: username,
            password: password
        }).then((response) => {
        //If login goes wrong set message saying why
           if(!response.data.auth){
            setLoginMessage(response.data.message)
           }else{
            //If everything goes right set loggin status to true, set localstorage item with JSON Web Token
            setLoginStatus(true);
            localStorage.setItem("token", response.data.token)
            setLoggedUser(response.data.userInfo)
           }
        })
    }

    //Make get request to the server to get list of users from the database. There is an access token send in the request
    const getUserList = () => {
        axios.get("http://localhost:3001/getUserList", {headers: {
            "x-access-token": localStorage.getItem("token")
        }}).then((response) => {
                setUserList(response.data)
        })
    }

    //On first page load check if there are cookies with already loggined user
    useEffect(() => {
        axios.get("http://localhost:3001/cookies").then((response) => {
            if(response.data.loggedIn === true){
                setLoginStatus(true)
                setLoggedUser(response.data.userInfo)
            }
        })
    }, [])

    return(
        <div className="loginPage">
            {/*If login status is false display login form else display message to user and "get user list" button*/}
            {!loginStatus ? (
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
                    {loginMessage}
                </div>
            ) : (
                <div className="loggedIn">
                    <p>{`Hello ${loggedUser}!`}</p>
                    <button onClick={getUserList}>Get user list</button>
                    {userList.map((user: User) => {
                        return(<p key={user.username}>{user.username}</p>)
                    })}
                </div>
            )}
        </div>
    )
}

export default Login;