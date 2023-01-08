import { FC, useState } from "react";
import { Link } from 'react-router-dom';
import '../styles/Register.css'
import axios from "axios";

const Register:FC = () => {
    const [username, setUsername] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [regMessage, setRegMessage] = useState<string>("");
    const [regStatus, setRegStatus] = useState<boolean>(false);

    //Make post request to server side
    const register = (e: React.SyntheticEvent): void => {
        e.preventDefault();
        
        axios.post('http://localhost:3001/register', {
            username: username,
            password: password,
        }).then((response) => {
            //If account was not created display message saying why
            if(!response.data.created){
                setRegMessage(response.data.message)
            }else{
                //Set loggin status to true and loggin message to "Account created"
                setRegMessage(response.data.message)
                setRegStatus(true)
            }
        })
    }

    return(
        <div className="registerPage">
            <div className="registerPageContent">
                {/*Register form*/}
                <form className="registerForm" onSubmit={register}>
                    <label>Username:</label>
                    <input type="text" onChange={(e: React.ChangeEvent<HTMLInputElement>) => {setUsername(e.target.value)}}/>
                    <label>Password:</label>
                    <input type="text" onChange={(e: React.ChangeEvent<HTMLInputElement>) => {setPassword(e.target.value)}}/>
                    <button type="submit">Create account</button>
                </form>
                {regMessage}
                {regStatus && <p><Link to='/'>Go back to login page</Link></p>}
            </div>
        </div>
    )
}

export default Register;