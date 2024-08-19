import mongoose, {Schema, model} from "mongoose";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

const userSchema = new Schema(
    {
        username : {
            type: String,
            required : true,
            unique : true,
            lowercase : true,
            trim : true,
            index : true
        },
        watchHistory : [
            {
                type : Schema.Types.ObjectId,
                ref : "Video"
            }
        ],
        email :{
            type: String,
            required : true,
            unique : true,
            lowercase : true,
            trim : true
        },
        fullname : {
            type: String,
            required : true,
            unique : true,
            lowercase : true,
            trim : true,
            index : true
        },
        avatar :{
            type: String,
            required : true
        },
        coverImage : {
            type : String
        },
        password :{
            type: String,
            required : [true, "Password is required"]
        },
        refreshToken : {
            type : String
        }
    },
    {timestamps : true}
)

//pre hook lets u add middleware function, learn about them on mongoose docs
userSchema.pre("save", async function (next) {
    if(!this.isModified("password"))    return next();
    this.password = await bcrypt.hash(this.password, 10);
    next();
})

//adding an custom method isPasswordCorrect for verifying passwords
userSchema.methods.isPasswordCorrect = async function (password){
    return  await bcrypt.compare(password, this.password);
}

//adding method to generate jwt tokens
userSchema.methods.generateAccessToken = function(){
    return jwt.sign(
        {
            _id : this._id,
            email : this.email,
            username : this.username
        },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn : process.env.ACCESS_TOKEN_EXPIRY
        }
    )
}
userSchema.methods.generateRefreshToken = function(){
    return jwt.sign(
        {
            _id : this._id
        },
        process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn : process.env.REFRESH_TOKEN_EXPIRY
        }
    )
}

export const User = model("User", userSchema);