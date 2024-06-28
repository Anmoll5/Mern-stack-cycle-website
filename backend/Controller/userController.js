const User = require ('../Models/userModel');
const asyncHandler = require('express-async-handler');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { generateTokenAndSetCookie } = require('../util/generateToken')



const getMe = asyncHandler(async(req,res) =>{
    res.status(200).json({ 
        hello 
      })

})

// @desc    Register new user
// @route   POST /api/users
// @access  Public
const registerUser = asyncHandler(async(req,res) =>{

    const {name , email, password} =req.body

    if(!name || !email || !password){
        res.status(400)
        throw new Error('Please add all fields')
    }

    //check if user exists
     const userExists = await User.findOne({ email })
     
     if(userExists){
        res.status(400);
        throw new Error('User already exists')
     }

     //Hash password
     const salt = await bcrypt.genSalt(10)
     const hashedPassword = await bcrypt.hash(password,salt);

     if(!hashedPassword){
        throw new Error("Something is wrong");
      }

     //Create user
     const user = await User.create({
        name,
        email,
        password:hashedPassword,
     });

     if(user) {
    // res.status(201).json({
    //     _id : user.id,
    //     name: user.name,
    //     email: user.email,
    //     token: generateTokenAndSetCookie(user._id),
    // })
      // Token generate and set cookie
      generateTokenAndSetCookie(user._id, res)
      const saveUser = await user.save();

      res.json({
        data : saveUser,
        success : true,
        error : false,
        message : "User created Successfully!"
      });
     }
     else{
        res.status(400)
        throw new Error('Invalid user data')
     }

})


// @desc    Authenticate a user
// @route   POST /api/users/login
// @access  Public
const loginUser = asyncHandler(async (req, res) => {
    const { email, password } = req.body
  
    // Check for user email
    const user = await User.findOne({ email })
  
    if (user && (await bcrypt.compare(password, user.password))) {
    //   res.json({
    //     _id: user.id,
    //     name: user.name,
    //     email: user.email,
    //     token: generateTokenAndSetCookie(user._id),
    //   })

    generateTokenAndSetCookie(user._id, res)

      res.json({
        message : "Login successfully",
        data : user,
        success : true,
        error : false
      });
      } else {
        res.status(400)
        throw new Error('Invalid credentials')
      }
  })

  // For Logout
const LogoutUser = asyncHandler(async(req, res) =>{
    try {
      res.clearCookie("token")
  
      res.json({
        message : "Logged out successfully",
        error : false,
        success : true,
        data : [],
      })
      
    } catch (error) {
      res.json({
        message : error.message || error,
        error : true,
        success : false,
      })
    }
  })


module.exports = {registerUser , getMe , loginUser , LogoutUser }

