// import express
const express = require("express");

//import userapp
const userApp=require('./routes/user.route')

//import restaurantApp
const restaurantApp=require('./routes/restaurant.route')

//import db from index.js
const db=require('./models/index')
//import datatypes
const {DataTypes}=require('sequelize')

const exp=require('express');


const app=express();
// Middleware
app.use(express.json());

require('dotenv').config()

const PORT=process.env.PORT||2828;
app.listen(PORT,()=>console.log(`http server running on ${PORT}....`))

//calling user
let User=db.User

//calling Restaurant
let Restaurant=db.Restaurant


//path middleware for user
app.use("/user-api", userApp);

//path middleware for restaurant

app.use("/restaurant-api",restaurantApp)

// invalid path
app.use("*", (req, res) => {
    res.send({ message: "Invalid path" });
  });
  // error handling middleware
  app.use((err, req, res, next) => {
    res.send({ message: err.message });
  });

//export the app
module.exports=app;








  
  

