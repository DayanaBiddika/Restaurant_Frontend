// import expressAsyncHandler
const expressAsyncHandler = require("express-async-handler");

//import user
const userModel=require('../models/user')

//import db from index.js
const db=require('../models/index')

//import restaurant
const restaurants=require('../models/restaurant')

//calling User
let User=db.User

//calling restaurant
let Restaurant=db.Restaurant

//get users
const getUsers=expressAsyncHandler(async(req,res)=>{
    let users=await User.findAll()
    res.send({message:"all users",payload:users})
});

//delete restaurant

const deleteRestaurant = expressAsyncHandler(async (req, res) => {
    try {
      const { id } = req.params;
  
      // Check if the user is an admin
      if (req.user && req.user.role !== 'Admin') {
        return res.status(403).send({ message: 'You do not have permission to delete a restaurant' });
      }
  
      // Find the restaurant by ID
      const restaurant = await Restaurant.findOne({ where: { id } });
  
      if (!restaurant) {
        return res.status(404).send({ message: 'Restaurant not found' });
      }
  
      // Perform soft delete by updating the deletedAt and deletedBy fields
      const updatedRestaurant = await restaurant.update({
        deletedAt: new Date(),
        deletedBy: req.user.email,
      });
  
      if (!updatedRestaurant) {
        return res.status(500).send({ message: 'Failed to delete restaurant' });
      }
  
      res.status(200).send({ message: 'Restaurant deleted successfully' });
    } catch (error) {
      console.error(error);
  }});

  //update the restaurant
  const updateRestaurant = expressAsyncHandler(async (req, res) => {
    try {
      const { name } = req.params;
      const { newName } = req.body;
  
      // Check if the user is authorized to update the restaurant
      if (req.user.role !== 'restaurantOwner') {
        return res.status(403).send({ message: 'You do not have permission to update a restaurant' });
      }
  
      // Find the restaurant by name
      const restaurant = await Restaurant.findOne({ where: { name } });
  
      if (!restaurant) {
        return res.status(404).send({ message: 'Restaurant not found' });
      }
  
      // Update the restaurant details
      restaurant.name = newName;
      restaurant.updatedBy = req.user.email;
      restaurant.updatedAt = new Date();
  
      await restaurant.save();
  
      res.status(200).send({ message: 'Restaurant updated successfully', data: restaurant });
    } catch (error) {
      console.error(error);
    }
  });
  
  
//export
module.exports={getUsers,deleteRestaurant,updateRestaurant};