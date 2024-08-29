import { request } from "express";
import mongoose, { mongo } from "mongoose";

const commentSchema = new mongoose.Schema(
    {
        user : {
            type : mongoose.Schema.Types.ObjectId,
            ref : "Video",
            required : true
        },

        video : {
            type : mongoose.Schema.Types.ObjectId,
            ref : "Video",
            required : true
        },

        description : {
            type : String,
            required : true
        }
    },{
        timestamps : true
    }
)

export default commentSchema = mongoose.model("Comment", commentSchema);