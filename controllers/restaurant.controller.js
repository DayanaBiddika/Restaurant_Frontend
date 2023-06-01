
// import expressAsyncHandler
const expressAsyncHandler = require("express-async-handler");

require("dotenv").config();

//import restaurant

const restaurant=require("../models/restaurant")

const address=require("../models/address")


//import db from index.js
const db=require('../models/index')
//import datatypes
const {DataTypes}=require('sequelize')

const { Op } = require('sequelize');

//calling Restaurant
let Restaurant=db.Restaurant

//calling Address
let Address=db.Address

  // create a restaurant
  const createRestaurant = expressAsyncHandler(async (req, res) => {
    try {
      const { name, addressId } = req.body;
      const role = req.role;
  
      // Check if the user role is authorized to create a restaurant
      if (role !== 'Admin' && role !== 'restaurantOwner') {
        return res.status(403).json({ message: 'You have no permission. Unauthorized access' });
      }
  
      // Create a new restaurant record in the database with createdBy, updatedBy, and addressId fields
      const createdBy = role;
      // const updatedBy = role;
  
      // Check if the provided addressId exists in the Address table
      const address = await Address.findByPk(addressId);
      if (!address) {
        return res.status(404).json({ message: 'Address not found' });
      }
  
      // Create the restaurant with the associated addressId
      const restaurant = await Restaurant.create({ name, createdBy, addressId });
  
      res.status(201).send({ message: 'Restaurant created successfully', data: restaurant });
    } catch (error) {
      console.error(error);
    }
  });
  
  //get restaurant by pagination

  const getRestaurants = async (req, res) => {
    try {
      const { page, pageSize } = req.params;
  
      // Check if the page and page size are valid positive integers
      if (!Number.isInteger(+page) || !Number.isInteger(+pageSize) || page <= 0 || pageSize <= 0) {
        return res.status(400).json({ message: 'Invalid page or pageSize' });
      }
  
      // Fetch the total count of restaurants
      const totalCount = await Restaurant.count();
  
      // Calculate the total number of pages
      const totalPages = Math.ceil(totalCount / pageSize);
  
      // Calculate the offset based on the page and page size
      const offset = (page - 1) * pageSize;
  
      // Fetch restaurants with pagination using Sequelize
      const restaurants = await Restaurant.findAll({
        limit: parseInt(pageSize),
        offset: parseInt(offset),
      });
  
      res.send({
        message: 'Restaurants retrieved successfully',
        data: restaurants,
        currentPage: page,
        totalPages: totalPages,
      });
    } catch (error) {
      console.error(error);
    }
  };

  //search restaurants on criteria
 const searchRestaurants=expressAsyncHandler(async(req,res)=>{
  const { name, city, state, country} = req.query;
const searchCriteria = {};

if (name) {
  searchCriteria ['$name$'] = {
      [Op.like]:"%"+name+"%"
    
  };
}
if (city) {
  searchCriteria['$Address.city$'] = {
    [Op.like]:"%"+city+"%"
  };
}
if (state) {
  searchCriteria['$Address.state$'] = {
    [Op.like]:"%"+state+"%"
  };
}
if (country) {
  searchCriteria['$Address.country$'] = {
    [Op.like]:"%"+country+"%"
  };
}

const restaurants = await db.Restaurant.findOne({
  include: [{ model: db.Address, where: searchCriteria }],
});

if (!restaurant) {
  return res.status(404).send({ message: 'Restaurant not found' });
}

res.status(200).send({ message: 'Restaurants found successfully', data: restaurants });
})



  //sort the restaurants on criteria

  const sortedRestaurants = expressAsyncHandler(async (req, res) => {
    try {
      const { sortBy, city, state, createdAt } = req.query;
  
      let sortField = 'name'; // Default sort field is 'name'
  
      // Check if sortBy query parameter is provided and valid
      if (sortBy) {
        const allowedSortFields = ['name', 'city', 'state', 'createdAt'];

        if (!allowedSortFields.includes(sortBy)) {
          return res.status(400).send({ message: 'Invalid sortBy parameter' });
        }

        sortField = sortBy;
      }
  
      // Build the filter object based on the provided query parameters
      const filter = {};
  
      if (city) {
        filter.city = city;
      }
  
      if (state) {
        filter.state = state;
      }
  
      if (createdAt) {
        filter.createdAt = createdAt;
      }
  
      // Get the sorted restaurant list from the database
      const restaurants = await Restaurant.findAll({
        where: filter,
        order: [[sortField, 'ASC']],
      });
  
      res.status(200).send({ message: 'Sorted restaurant list', data: restaurants });
    } catch (error) {
      console.error(error);
    }
  });

  //filter the restaurants
  const filteredRestaurants = expressAsyncHandler(async (req, res) => {
    try {
      const { country, state } = req.body;
  
      // Build the filter object based on the provided query parameters
      const filter = {};
  
      if (country) {
        filter.country = country;
      }
  
      if (state) {
        filter.state = state;
      }
  
      // Get the filtered restaurant owners' list from the database
      const addresses = await Address.findAll({
        where: filter,
      });
  
      res.status(200).send({ message: 'Filtered restaurants list', data: addresses });
    } catch (error) {
      console.error(error);
    }
  });
  

  //get all restaurants
const getAllRestaurants=expressAsyncHandler(async(req,res)=>{
  let restaurants=await Restaurant.findAll()
    res.send({message:"all users",payload:restaurants})
})

//export
module.exports={createRestaurant,getRestaurants,searchRestaurants,getAllRestaurants,sortedRestaurants,filteredRestaurants}
  

 