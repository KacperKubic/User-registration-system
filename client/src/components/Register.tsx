import { FC, useState } from "react";
import '../styles/Register.css'
import axios from "axios";

const Register:FC = () => {
    const [username, setUsername] = useState<string>("");
    const [password, setPassword] = useState<string>("");

    const register = (e: React.SyntheticEvent): void => {
        e.preventDefault();
        
        axios.post('http://localhost:3001/register', {
            username: username,
            password: password,
        })
    }

    return(
        <div className="registerPage">
            <div className="registerPageContent">
                <form className="registerForm" onSubmit={register}>
                    <label>Username:</label>
                    <input type="text" onChange={(e: React.ChangeEvent<HTMLInputElement>) => {setUsername(e.target.value)}}/>
                    <label>Password:</label>
                    <input type="text" onChange={(e: React.ChangeEvent<HTMLInputElement>) => {setPassword(e.target.value)}}/>
                    <button type="submit">Create account</button>
                </form>
            </div>
        </div>
    )
}

export default Register;