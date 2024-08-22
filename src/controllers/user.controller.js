import asyncHandler from "../utilities/asyncHandler.js";
import { User } from "../models/user.model.js"
import uploadOnCloudinary from "../utilities/cloudinary.utility.js";

const generateAccessAndRefreshToken = async (userId)=>{
    try{
        const user = await User.findById(userId);
        const accessToken = user.generateAccessToken()
        const refreshToken = user.generateRefreshToken()

        user.refreshToken = refreshToken;
        await user.save({ValidateBeforeSave : false}); //we dont want mongoose to kick in and verify while schema
        
        return {accessToken, refreshToken};

    }catch(error){
        res.status(500).json("Error while generating tokens")
    }
}

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

const loginUser = asyncHandler( async (req, res) => {
    //get email, username, password
    //if user does not exist, ask him to register
    //check the password
    //access and refresh token generate
    //send tokens in secure cookie
    //user is logged in

    const {username, email, password} = req.body;

    if(!username && !email){
        res.status(400).json("Enter username or email")
    }

    if(!password){
        res.status(400).json("Password is required")
    }

    const user = await User.findOne({$or : [{username}, {email}]});
    if(!user){
        res.status(400).json("You dont have any account, Register Please");
    }

    let passwordCheck = await user.isPasswordCorrect(password)
    if(!passwordCheck){
        res.status(400).json("Password is wrong")
    }

    const {accessToken, refreshToken} = await generateAccessAndRefreshToken(user._id);

    const loggedInUser = await User.findById(user._id).select("-password -refreshToken")

    const options = {
        httpOnly : true,
        secure : true //now only server can modify cookies
    }

    return res.status(200).cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
        {
            user : loggedInUser,
            accessToken,
            refreshToken,
            message : "User logged in successfully."
        }
    )
})

const logoutUser = asyncHandler( async (req, res) => {
    //clear cookies
    //remove refreshtoken from his db
    const user = User.findByIdAndUpdate(
        req.user._id,
        {
            $set : {refreshToken : undefined}
        },
        {
            new : true
        }
    )

    const options = {
        httpOnly : true,
        secure : true //now only server can modify cookies
    }

    return res.status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json("User Logged Out Successfully")
    
})

export {
    registerUser, 
    loginUser,
    logoutUser
}
