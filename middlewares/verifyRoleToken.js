const expressAsyncHandler=require("express-async-handler")
const jwt=require("jsonwebtoken")
require("dotenv").config()

const verifyRoleToken = expressAsyncHandler(async (req, res, next) => {

  console.log("--------------------")
  
    // Get the token from header.authorization
    const bearerToken = req.headers.authorization;
    console.log(bearerToken);
    
    // If there is no bearer token
    if (!bearerToken) {
      return res.status(401).json({ message: "Unauthorized access" });
    }
    
    // If there is a token, check its validity
    let token = bearerToken.split(" ")[1];
    console.log(token);
    // let role=bearerToken.split(".")[3];
    // console.log("role-1",role)
    

    // token=token.split(".")
    // let finalToken=token[0]+"."+token[1]+"."+token[2]
    // console.log(finalToken)
    try {
      // console.log("role-2",role)
       jwt.verify(token, process.env.SECRET_KEY,(err,decoded)=>{
       if(err){
        console.log(err);
       }
       else
       {
        console.log(decoded);
        // console.log(decoded.role)
        if (decoded.role === "Admin" || decoded.role === "restaurantOwner") {
          req.role = decoded.role; // Add the user role to the request object
          //  console.log("role-3")
          
          
  
          next(); // Proceed to the next middleware or route handler
        } else {
           console.log("role-4")
           res.status(403).send({ message: "You have no permission. Unauthorized access" });
        }
       }
      //  console.log("hiiiiiii");

       });

      
      
      // Check the role
      // const role=decodedToken.role;
       
     
    } catch (err) {
    }
  });
  
  module.exports = verifyRoleToken;
  