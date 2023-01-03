"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const mysql_1 = __importDefault(require("mysql"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use((0, cors_1.default)({
    origin: ["http://localhost:3000"]
}));
const saltRounds = 10;
const db = mysql_1.default.createConnection({
    host: "localhost",
    user: "root",
    password: "root",
    database: "notes"
});
app.post("/register", (req, res) => {
    const username = req.body.username;
    const password = req.body.password;
    bcrypt_1.default.hash(password, saltRounds, (err, hash) => {
        if (err) {
            console.log(err);
        }
        db.query("INSERT INTO users (username, password) VALUES (?,?)", [username, hash], (err, result) => {
            if (err) {
                console.log(err);
            }
        });
    });
});
app.listen(3001, () => {
    console.log('Server is running on port 3001');
});
