// create restaurantApp mini express application
const express = require("express");

const restaurantApp = express.Router();
restaurantApp.use(express.json());

//import controllers from restaurant controller

const {createRestaurant, getRestaurants, searchRestaurants, getAllRestaurants, sortedRestaurants, filteredRestaurants}=require("../controllers/restaurant.controller")

const token=require('../middlewares/verifyToken')

const verifyRoleToken=require('../middlewares/verifyRoleToken')

//create restaurant
restaurantApp.post("/restaurants",verifyRoleToken,createRestaurant)

//get restaurant by pagination
restaurantApp.get("/get-restaurant/:page/:pageSize",getRestaurants)

//search the restaurant
restaurantApp.get("/search-restaurant",searchRestaurants)

//get all restaurants
restaurantApp.get("/get-restaurants",getAllRestaurants)

//sorted restaurants
restaurantApp.get("/sorted-restaurants",sortedRestaurants)

//filter restaurants
restaurantApp.post("/filter-restaurant",filteredRestaurants)

//export
module.exports=restaurantApp;