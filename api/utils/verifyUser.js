import { errorHandler } from "./error.js";
import jwt from "jsonwebtoken";
import User from "../models/user.model.js";

export const verifyToken = (req,res,next)=>{
    const token=req.cookies.access_Token;
    if (!token){
        return next(errorHandler(401,"Signin required"));
    }
    jwt.verify(token,process.env.JWT_SECRET,(err,user)=>{
        if (err){
            return next(errorHandler(403,"Forbidden!!!"));
        }
        req.user=user;
        next();
    });
}

export const verifyAdmin =(req,res,next)=>{
    const token=req.cookies.access_Token;
    if (!token){
        return next(errorHandler(401,"Sigin required"));
    }
    jwt.verify(token,process.env.JWT_SECRET,async (err,user)=>{
        if (err){
            return next(errorHandler(403,"Forbidden!!!"));
        }
        const profile= await User.findOne({ _id: user.id });
        if (profile && profile.username==="admin"){
            next();
        }
        else{
            return next(errorHandler(403,"Admin access Required!!!"));
        }
        // req.user=user;
        // console.log(user);
    });
}