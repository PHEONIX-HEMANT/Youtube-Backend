import mongoose from "mongoose";

const playlistSchema = new mongoose.Schema(
    {
        name :{
            type : String,
            lowercase : true,
        },
        description : {
            type : String,
        },
        videos : [
            {
                type : mongoose.Schema.Types.ObjectId,
                ref : "Video"
            }
        ],
        user : {
            type : mongoose.Schema.Types.ObjectId,
            ref : "User"
        }
    },
    {timestamps : true}
)

export default playlistSchema = mongoose.Model("Playlist", playlistSchema);