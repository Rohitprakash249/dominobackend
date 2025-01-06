const express = require("express");
const bodyParser = require("express");
const User = require("./models/userModel");
const Order = require("./models/orderModel");
const bcrypt = require('bcryptjs');
const jwt = require("jsonwebtoken");
const cookieParser = require('cookie-parser');
const {promisify} = require("util");
const userFunctions = require("./models/userFunctions");
const cors = require('cors');
const app = express();
const corsOptions = {
    origin: 'https://dominoclonefullstack.vercel.app/' ,  // List of allowed domains
    credentials: true, // Allow cookies to be sent and received
    methods: ['GET', 'POST', 'PUT', 'DELETE'],  // Allowed methods
    allowedHeaders: ['Content-Type', 'Authorization'],  // Allowed headers
    // "Content-Type": "application/json"
};
// const corsOptions = {
//     origin: '*' ,  // List of allowed domains
//     credentials: true, // Allow cookies to be sent and received
//     methods: ['GET', 'POST', 'PUT', 'DELETE'],  // Allowed methods
//     allowedHeaders: ['Content-Type', 'Authorization'],  // Allowed headers
//     // "Content-Type": "application/json"
// };
app.use(cors(corsOptions))
app.use(bodyParser.json());
app.use(cookieParser());

app.post("/api/register",userFunctions.signup );
app.post("/api/login",userFunctions.login );
app.get("/api/getorders",userFunctions.validateToken , (req,res)=>{
    res.json({message:"login working"});
})

app.get("/api/getUserDetails",userFunctions.getUserDetails)
app.post("/api/updateAddress",userFunctions.updateAddress)
app.post("/api/setSelectedAddress",userFunctions.setSelectedAddress)
app.post("/api/createOrder",userFunctions.createOrder)
app.get("/api/getAllOrders",userFunctions.getAllOrders)
app.post("/api/logout",(req,res)=>{
    res.cookie("jwt", "empty", {
        expires: new Date(
            Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
        ),
        // secure: true,
        httpOnly: true,
    });
    res.json({message:"logout success"});
})

app.get("/", (req,res)=>{
    res.send("server is running now.Now you can send Api requests.")
})


module.exports = app;
