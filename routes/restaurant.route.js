// create restaurantApp mini express application
const express = require("express");

const restaurantApp = express.Router();
restaurantApp.use(express.json());

//import controllers from restaurant controller

const {createRestaurant, getRestaurants, searchRestaurants}=require("../controllers/restaurant.controller")

const token=require('../middlewares/verifyToken')

const verifyRoleToken=require('../middlewares/verifyRoleToken')

//create restaurant
restaurantApp.post("/restaurants",verifyRoleToken,createRestaurant)

//get restaurant
restaurantApp.get("/get-restaurant/:page/:pageSize",getRestaurants)

//search the restaurant
restaurantApp.post("/search-restaurant",searchRestaurants)

//export
module.exports=restaurantApp;