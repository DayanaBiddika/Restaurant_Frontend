// import expressAsyncHandler
const expressAsyncHandler = require("express-async-handler");

//import user
const userModel=require('../models/user')

//import db from index.js
const db=require('../models/index')

//import restaurant
const Restaurant=require('../models/restaurant')

//calling User
let User=db.User

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
  
      // Perform soft delete by updating the deletedAt and deletedBy fields
      const [rowsAffected] = await Restaurant.update(
        {
          deletedAt: new Date(),
          deletedBy: req.user.email
        },
        {
          where: { id}
        }
      );
  
      if (rowsAffected === 0) {
        return res.status(404).send({ message: 'Restaurant not found' });
      }
  
      res.status(200).send({ message: 'Restaurant deleted successfully' });
    } catch (error) {
      console.error(error);
    }
  });
  
  
//export
module.exports={getUsers,deleteRestaurant};