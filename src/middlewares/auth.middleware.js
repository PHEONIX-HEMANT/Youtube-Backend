//it will verify whether user is there or not

import jwt from "jsonwebtoken";
import asyncHandler from "../utilities/asyncHandler.js";
import { User } from "../models/user.model.js";

export const verifyJWT = asyncHandler( async (req, res, next) => {
    //req can use cookies because we have used cookieParser as middleware
    try {
        const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ", "")
    
        if(!token)  res.status(401).json("Unauthorised request")
    
        const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)
    
        const user = await User.findById(decodedToken?._id).select("-password -refreshToken")
        if(!user)   
            res.status(401).json("Invalid access token")
    
        req.user = user;
        next()
    } catch (error) {
        res.status(401).json(error.message, "Invalid access")
    }
})