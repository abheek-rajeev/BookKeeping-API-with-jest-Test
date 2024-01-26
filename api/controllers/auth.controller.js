import User from "../models/user.model.js";
import bcryptjs from 'bcryptjs';
import {errorHandler} from "../utils/error.js"
import jwt from "jsonwebtoken";

export const signup = async(req,res,next)=>{
    const {username,email,password}=req.body;
    const hashpassword=bcryptjs.hashSync(password,12);
    const newUser= new User({username,email,password:hashpassword})
    try{
        await newUser.save();
        console.log("user created succefulluy")
        res.status(201).json("user created succesfully");
    }
    catch(err){
        next(err);
    }   
}

export const signin = async(req,res,next)=>{
    const {email,password}=req.body;
    try{
        const validUser= await User.findOne({email});
        if (!validUser){
            return next(errorHandler(404,"Invalid Credentials!"));
        }
        const validPassword = bcryptjs.compareSync(password,validUser.password);
        if (!validPassword){
            return next(errorHandler(401,"Invalid Credentials!"));
        }
        const token =jwt.sign({id: validUser._id},process.env.JWT_SECRET)
        const {password:pass, ...rest}=validUser._doc;
        // ,expires:new Date(Date.now()+24*60*60)
        res
            .cookie("access_Token",token,{httpOnly:true})
            .status(200)
            .json(rest);
        
    } catch (error) {
        next(error);
    }
}

export const signout = (req,res,next) =>{
    try{
        res.clearCookie('access_Token');
        res.status(200).json("User has been Logged Out!!!")
    }catch(err){
        next(err)
    }
}