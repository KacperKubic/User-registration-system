import express from 'express';
import cors from 'cors';
import mysql from 'mysql';
import bcrypt from 'bcrypt';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import session from 'express-session';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

declare module "express-session" {
    interface SessionData{
        user: string;
    }

    interface SessionOptions{
        key: string;
    }
}

//Setting up express app, CORS and Sessions settings
const app = express()
app.use(express.json());
app.use(cors({
    origin: ["http://localhost:3000"],
    credentials: true,
}))
app.use(cookieParser());
app.use(bodyParser.urlencoded({extended: true}))
app.use(session({
    key: "userId",
    secret: "secretSessionKey",
    resave: false,
    saveUninitialized: false,
    cookie:{
        maxAge: 60 * 60 * 60,
    },
}))
dotenv.config()
const saltRounds = 10;

//Creating connection with MySQL database
const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "root",
    database: "loginsystem"
})

//Function that verifies if the JSON Web Token passed in API request is correct or not
const verifyJWT = (req, res, next) => {
    const token = req.headers["x-access-token"]

    if(!token){
        res.send("You need an accesses token")
    }else{
        jwt.verify(token, "secretKey", (err, decoded) => {
            if(err){
                res.json({auth: false, message: "You failed to authenticate"})
            }else{
                req.userId = decoded.id
                next()
            }
        })
    }
}

//Creating user in the database
app.post("/register", (req, res) => {
    const username: string = req.body.username;
    const password: string = req.body.password;
    const query: string = "INSERT INTO users (username, password) VALUES (?,?)"

    db.query("SELECT * from users WHERE username = ?", username, (err, result) => {
        if(err){
            console.log(err)
        }else{
            //If there is no user with given username hash the password and create new user in the database
            if(result.length === 0){
                bcrypt.hash(password, saltRounds, (err, hash) => {
                    if(err){
                        console.log(err);
                    }
                    db.query(query, [username, hash], (err, result) =>{
                        if(err){
                            console.log(err);
                        }else(
                            res.json({created: true, message: "Account successfully created"})
                        )
                    })
                })
            }else{
                //If the user with given username already exist send error message
                res.json({created: false, message: "Username already taken. Choose another one"})
            }
        }
    })
})

//Login
app.post("/login", (req, res) => {
    const username: string = req.body.username;
    const password: string = req.body.password;
    const query: string = "SELECT * FROM users WHERE username = ?"

    db.query(query, username, (err, result) => {
        if(err){
            res.send({message: err})
        }

        //If the username exist check if the given password is correct. If so create session and json web token
        if(result.length>0){
            bcrypt.compare(password, result[0].password, (err, response) => {
                if(response){
                    const id = result[0].id;
                    const token = jwt.sign({id}, "secretKey", {
                        expiresIn: 300,
                    })

                    req.session.user = result[0].username;
                    res.json({auth: true, token: token, userInfo: result[0].username})
                }else{
                    //If the given password is wrong send error message
                    res.json({auth: false, message: "Wrong user - password combination"})
                }
            })
        }else{
            //If there is no user with given username send error message
            res.json({auth: false, message: "User doesn't exist"})
        }
    })
})

//If there is a session with given user set its loggin status to true and send it to the frontend
app.get("/cookies", (req, res) => {
    if(req.session.user){
        res.send({loggedIn: true, userInfo: req.session.user});
    }else{
        res.send({loggedIn: false})
    }
})

//Get all the users from the database and send it to the frontend ONLY if the user have correct JSON Web Token
app.get('/getUserList', verifyJWT, (req, res)=> {
    const query: string = "SELECT username FROM users"

    db.query(query, (err, result) => {
        if(err){
            res.send({err})
        }else{
            res.send(result)
        }
})})

app.listen(3001, () => {
    console.log('Server is running on port 3001')
})