import { v2 as cloudinary } from 'cloudinary';
import { error } from 'console';
import fs from "fs";

cloudinary.config({ 
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
    api_key: process.env.CLOUDINARY_API_KEY, 
    api_secret: process.env.CLOUDINARY_API_SECRET
});

const uploadOnCloudinary = async (localFilePath) => {
    try{
        // console.log("trying to upload ", localFilePath)
        if(!localFilePath)  return null;
        //upload the file on cloudinary
        const response = await cloudinary.uploader.upload(localFilePath, {
            resource_type : "auto"
        })
        //file has been uploaded
        // console.log("File has been uploaded to cloudinary.", response.url);
        //delete the file from the local storage
        fs.unlinkSync(localFilePath);
        return response;
    }catch(error){
        // console.log("Error uploading file to cloudinary", error.message);
        return null
    }
}

export default uploadOnCloudinary