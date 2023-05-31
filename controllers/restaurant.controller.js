// import bcryptjs
const bcryptjs = require("bcryptjs");

// import jwt
const jwt = require("jsonwebtoken");

const token=require('../middlewares/verifyToken')

const verifyRoleToken=require('../middlewares/verifyRoleToken')

// import expressAsyncHandler
const expressAsyncHandler = require("express-async-handler");

require("dotenv").config();

//import restaurant

const restaurant=require("../models/restaurant")

const Address=require("../models/address")

//import db from index.js
const db=require('../models/index')
//import datatypes
const {DataTypes}=require('sequelize')

const { Op } = require('sequelize');

//calling Restaurant
let Restaurant=db.Restaurant

  // create a restaurant
const createRestaurant= expressAsyncHandler(async (req, res) => {
    try {
      // Extract the restaurant name and user role from the request body and request object
      const { name } = req.body;
      const role = req.role;
      console.log("----------",role)
    
      // Check if the user role is authorized to create a restaurant
      if (role !== "Admin" && role !== "restaurantOwner") {
        return res.status(403).json({ message: "You have no permission. Unauthorized access" });
      }
      else{
    
      // Create a new restaurant record in the database with createdBy and updatedBy fields
      const createdBy = role; // Set the createdBy field to the user role
      const updatedBy = role; // Set the updatedBy field to the user role
      const restaurant = await Restaurant.create({ name, createdBy, updatedBy });
    
      res.status(201).send({ message: 'Restaurant created successfully', data: restaurant });
    } }catch (error) {
      console.error(error);
    }
  });

  

  //get restaurant by pagination
  const getRestaurants = async (req, res) => {
    try {
      const { page, pageSize } = req.params;
  
      // Calculate the offset based on the page and page size
      const offset = (page - 1) * pageSize;
  
      // Fetch the total count of restaurants
      const totalCount = await Restaurant.count();
  
      // Check if the page size is greater than 0 and less than or equal to the total count
      if (pageSize <= 0 || pageSize > totalCount) {
        return res.status(400).send({ message: 'Invalid pageSize' });
      }
  
      // Fetch restaurants with pagination using Sequelize
      const restaurants = await Restaurant.findAll({
        limit: parseInt(pageSize),
        offset: parseInt(offset),
      });
  
      res.send({ message: 'Restaurants retrieved successfully', data: restaurants });
    } catch (error) {
      console.error(error);
    }
  };

  //search restaurants on criteria
  const searchRestaurants = async (req, res) => {
    try {
      const { name, city, state, country, pincode } = req.body;
  
      // Construct the search criteria based on the provided parameters
      const searchCriteria = {
        name: name ? { [Op.like]: `%${name}%` } : "",
        // '$Address.city$': city ? { [Op.like]: `%${city}%` } : "",
        // '$Address.state$': state ? { [Op.like]: `%${state}%` } : "",
        // '$Address.country$': country ? { [Op.like]: `%${country}%` } : "",
        // '$Address.pincode$': pincode ? { [Op.like]: `%${pincode}%` } : ""
      };
      console.log(searchCriteria,req.body)
  
      // Find restaurants based on the search criteria and include the associated address
      const restaurants = await Restaurant.findAll({
        where: searchCriteria,
        include: { model: Address, as: 'address'}
      });
  
      res.status(200).send({ message: 'Restaurants found successfully', data: restaurants });
    } catch (error) {
      console.error(error);
      
  }};
  
  
//export
module.exports={createRestaurant,getRestaurants,searchRestaurants}
  

 