import express from 'express';
import cors from 'cors';
import mysql from 'mysql';
import bcrypt from 'bcrypt';

const app = express()
app.use(express.json());
app.use(cors({
    origin: ["http://localhost:3000"],
    credentials: true,
}))

const saltRounds = 10;

const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "root",
    database: "loginsystem"
})

app.post("/register", (req, res) => {
    const username: string = req.body.username;
    const password: string = req.body.password;
    const query: string = "INSERT INTO users (username, password) VALUES (?,?)"

    bcrypt.hash(password, saltRounds, (err, hash) => {
        if(err){
            console.log(err);
        }
        db.query(query, [username, hash], (err, result) =>{
            if(err){
                console.log(err);
            }
        })
    })
})

app.post("/login", (req, res) => {
    const username: string = req.body.username;
    const password: string = req.body.password;
    const query: string = "SELECT * FROM users WHERE username = ?"

    db.query(query, username, (err, result) => {
        if(err){
            res.send({message: err})
        }

        if(result.length>0){
            bcrypt.compare(password, result[0].password, (err, response) => {
                if(response){
                    res.send(result)
                }else{
                    res.send({message: "Wrong username - password combination"})
                }
            })
        }else{
            res.send({message: "User doesn't exist"})
        }
    })
})

app.listen(3001, () => {
    console.log('Server is running on port 3001')
})