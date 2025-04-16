const jwt = require('jsonwebtoken');
const User = require('../models/User');

const generatetoken = (id)=>{
    return jwt.sign({id},process.env.JWT_SECRET,{expiresIn:"1h" })
}

exports.registerUser = async(req,res)=>{
    const {fullname,email,password,profileImageUrl} = req.body;
    if(!fullname || !email || !password){
        return res.status(400).json({message:"Please fill all fields"});
    }

    try{
        const existingUser = await User.findOne({email});
        if(existingUser){
            return res.status(400).json({message:"Email already in use"});
        }

        const user = await User.create({
            fullname,
            email,
            password,
            profileImageUrl
        });

        res.status(201).json({
            id:user._id,
            user,
            token: generatetoken(user._id),
        });
    }catch(err){
        res.json({message:"Error in registration",error:err.message});
    }
}

exports.loginUser = async(req,res)=>{
    const {email,password} = req.body;
    if(!email || !password){
        return res.status(400).json({message:"All field are required"});
    }

    try{
        const user = await User.findOne({email});
        if(!user||!(await user.comparePassword(password))){
            return res.status(400).json({message:"Invalid credentials"});
        }

        res.status(200).json({
            id:user._id,
            user,
            token: generatetoken(user._id),
        });
    }catch(err){
        res.status(500).json({message:"Error in login",error:err.message});
    }
}

exports.getUserInfo = async(req,res)=>{
    try{
        const user = await User.findById(req.user._id).select("-password");
        if(!user){
            return res.status(404).json({message:"User not found"});
        }
        res.status(200).json(user);
    }catch(err){
        res.status(500).json({message:"Error in getting user info",error:err.message});
    }
}