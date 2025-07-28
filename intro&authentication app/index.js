//Node.js creating server and importing components
// //const http= require("http");// importing http from node modules old method in modern it is same as react import export..just change needed type; "module"
// import http from "http"
// import {lovepercentage} from "./features.js"
// import fs, { readFile } from "fs"
// import path from "path"

// console.log(path.basename("/home/index/utkarsh/home.jsx")) // home.jsx
// console.log(path.dirname("/index/home/utkarsh/page.jsx"))// /index/home/utkarsh


// const home=fs.readFileSync("./index.html")

// const server=http.createServer((request,response)=>{// creating server using createserver
//     if(request.url==="/about") {
//         response.end(`<h1>About Page ${lovepercentage()} </h1>`)
//     }
//     else if(request.url==="/") {
//        response.end(home);
//     }
//     else {
//         response.end("<h1>Other Pages</h1>")
//     }
// });

// server.listen(5501,()=>{
//     console.log("SERVER IS WORKING");
// });








//creating a contact page and storing the data in the database
// import express from "express";
// import path from "path";
// import mongoose from "mongoose";
// import { name } from "ejs";

// mongoose.connect("mongodb://localhost:27017",{dbName: "backend"}).then(()=>console.log("Database is connected"));

// const messageschema= new mongoose.Schema({
//     name : String,
//     email: String
// })

// const Message= mongoose.model("Message", messageschema)

// const app = express();

// // Set EJS as the template engine
// app.set("view engine", "ejs");

// // Serve static files from the "public" folder
// app.use(express.static(path.join(path.resolve(), "public")));

// // Middleware to parse form data (urlencoded)
// app.use(express.urlencoded({ extended: true }));


// const users=[];//stores the input form data


// // GET route for rendering the form
// app.get("/", (req, res) => {
//   res.render("index", { name: "CONTACT NOW" }); // Render index.ejs with dynamic data
// });

// // app.get("/add",async(req,res)=>{
// //     await Message.create({name:"usr",email:"utkarsh@gmail.com"}).then(()=>{
// //         res.send("Done");
// //     })
// // })


// app.get("/success",(req,res)=>{
//     res.render("success");
// })



// // POST route to handle form submission
// app.post("/contact", async(req, res) => {
//   const userData=({name: req.body.name, email: req.body.email});//instead of meshing just create const {name,email}=req.body and if key and value pair name is same then Message.create({name,email}) otherwiese Message.create({name: name, email: email})
//   await Message.create(userData);
//   console.log(req.body); // Logs { username: "...", email: "..." }
//   res.redirect("/success");
// });


// app.get("/users",(req,res)=>{//if normally it is used then routing otherwise if it's used to send the data then its api
//     res.json({users,});
// })


// // Start the server
// app.listen(5501, () => {
//   console.log("Server is Working");
// });












import express from "express";           // Web framework to create server
import path from "path";                 // Helps handle file paths
import mongoose from "mongoose";         // Used to connect and work with MongoDB
import cookieParser from "cookie-parser"; // Lets us access cookies sent by browser
import jwt from "jsonwebtoken";          // For creating login tokens
import bcrypt from "bcrypt";             // For safely storing encrypted passwords

// Connect to local MongoDB database
mongoose.connect("mongodb://localhost:27017", { dbName: "backend" })
  .then(() => console.log("Database is connected"));

// Create the express app
const app = express();

// Set EJS as the template engine (used to render HTML pages)
app.set("view engine", "ejs");

// Parse form data from HTML pages
app.use(express.urlencoded({ extended: true }));

// Serve static files like CSS from the "public" folder
app.use(express.static(path.join(path.resolve(), "public")));

// Allow reading cookies from browser
app.use(cookieParser());

// Define structure of a user in the database
const userSchema = new mongoose.Schema({
    name: String,
    email: String,
    password: String,  // This will be hashed using bcrypt
});

// Create a model to interact with the user collection in MongoDB
const user = mongoose.model("user", userSchema);

// Middleware to check if a user is logged in
const isAuthenticated = async (req, res, next) => {
    const { token } = req.cookies;  // Get the token stored in browser cookies

    if (token) {
        const decoded = jwt.verify(token, "utkarshsinghrajput"); // Decode the token
        req.user = await user.findById(decoded._id); // Get user details from DB
        next();  // Move to the next route
    } else {
        res.redirect("/login"); // If no token, redirect to login page
    }
};

// Homepage - only accessible after login
app.get("/", isAuthenticated, (req, res) => {
    res.render("logout", { name: req.user.name }); // Show logout page with user's name
});

// Display the signup form
app.get("/signUp", (req, res) => {
    res.render("signUp");
});

// Display the login form
app.get("/login", (req, res) => {
    res.render("login");
});

// Handle login form submission
app.post("/login", async (req, res) => {
    const { email, password } = req.body; // Get login input

    const check = await user.findOne({ email }); // Look for the user in the database

    if (check) {
        const isMatch = await bcrypt.compare(password, check.password); // Compare hashed password

        if (isMatch) {
            const token = jwt.sign({ _id: check._id }, "utkarshsinghrajput"); // Create a login token

            // Store token in cookie to keep user logged in
            res.cookie("token", token, {
                httpOnly: true,
                expires: new Date(Date.now() + 60 * 1000), // Expires in 1 minute
            });

            res.redirect("/"); // Go to homepage
        } else {
            res.render("login", { message: "Incorrect Password" }); // Show error if password wrong
        }
    } else {
        res.redirect("/signUp"); // If user not found, ask them to sign up
    }
});

// Handle signup form submission
app.post("/signUp", async (req, res) => {
    const { name, email, password } = req.body; // Get signup input

    const checkUser = await user.findOne({ email }); // Check if email already exists

    if (checkUser) {
        res.redirect("/login"); // If user exists, ask them to login
    } else {
        const hashPassword = await bcrypt.hash(password, 10); // Hash the password before saving
        const newUser = await user.create({ name, email, password: hashPassword }); // Save user

        const token = jwt.sign({ _id: newUser._id }, "utkarshsinghrajput"); // Create token

        // Store token in cookie to keep user logged in
        res.cookie("token", token, {
            httpOnly: true,
            expires: new Date(Date.now() + 60 * 1000), // Expires in 1 minute
        });

        res.redirect("/"); // Redirect to homepage
    }
});

// Logout route - removes login token
app.get("/logout", (req, res) => {
    res.cookie("token", null, {
        httpOnly: true,
        expires: new Date(Date.now()), // Expire token immediately
    });

    res.redirect("/login"); // Go back to login after logout
});

// Start the server on port 5501
app.listen(5501, () => {
    console.log("Server is Working");
});
