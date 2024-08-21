import asyncHandler from "../utilities/asyncHandler.js";
import { User } from "../models/user.model.js"
import uploadOnCloudinary from "../utilities/cloudinary.utility.js";

const registerUser = asyncHandler( async (req, res) => {
    //get user details from frontend
    //validation - not empty
    //check if user already exists : username, email (any one)
    //check for images, check for avatar
    //upload them to cloudinary, avatar is uploaded or not
    //create user object - create entry in db
    //check for user creation using response
    //remove password and refresh token field from response
    //return response

    const {username, email, fullname, password} = req.body;

    if( !username || !email || !fullname || !password ){
        return res.status(400).json("All fields are required")
    }

    const existedUser = await User.findOne({$or: [{username}, {email}]})

    if(existedUser){
        console.log(existedUser)
        return res.status(409).json("User Already Exists")
    }

    console.log(req.files);
    // return res.status(200).json("returned from middle")
    const avatarLocalPath = req.files?.avatar[0]?.path; //req.files is added by multer
    const coverImageLocalPath = req.files?.coverImage[0]?.path;

    if(!avatarLocalPath)
        return res.status(409).json("Avatar is needed.")

    const avatar = await uploadOnCloudinary(avatarLocalPath);

    const coverImage = await uploadOnCloudinary(coverImageLocalPath);

    if(!avatar)
        return res.status(409).json("Avatar is not uploaded.")

    const user = await User.create({
        username : username.toLowerCase(),
        email : email,
        fullname : fullname,
        avatar : avatar.url,
        password : password,
        coverImage : coverImage?.url || "",
    })

    const createdUser = await User.findById(user._id).select(
        "-password -refreshToken" // - means do not include these
    )

    if(!createdUser)    return res.status(500).json("Something went wrong while registering the user.")

    return res.status(200).json({createdUser})
});

export default registerUser;
