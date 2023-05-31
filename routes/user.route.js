// create userApp mini express application
const express = require("express");

const userApp = express.Router();

userApp.use(express.json());

// import middlewares from user middleware
const { registerUser, loginUser} = require("../middlewares/users.middlewares");

//import controllers from user controller

const {getUsers,deleteRestaurant}=require("../controllers/user.controller");

const verifyAdminToken = require("../middlewares/verifyAdminToken");



//register user
userApp.post("/register-user",registerUser)

//login user

userApp.post("/login",loginUser)

//get users

userApp.get("/get-users",getUsers)

//delete user
userApp.delete("/delete-restaurant/:id",verifyAdminToken,deleteRestaurant)


//export
module.exports=userApp;