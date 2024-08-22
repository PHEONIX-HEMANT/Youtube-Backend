import { Router } from "express";
import {registerUser, loginUser, logoutUser, refreshAccessToken, changeCurrentPassword, getCurrentUser, updateAccountDetails, updateAvatar, updateCoverImage } from "../controllers/user.controller.js";
import { upload } from "../middlewares/multer.middleware.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const userRouter = Router();

userRouter.route("/register").post(
    upload.fields([
        {
            name : "avatar",
            maxCount : 1
        },
        {
            name : "coverImage",
            maxCount : 1
        }
    ]),
    registerUser
)

userRouter.route("/login").post(
    loginUser
)

//secure routes
userRouter.route("/logout").post(
    verifyJWT,
    logoutUser
)

userRouter.route("/refresh-token").post(
    refreshAccessToken
)

userRouter.route("/changePassword").patch(
    verifyJWT,
    changeCurrentPassword
)

userRouter.route("/updateDetails").patch(
    verifyJWT,
    updateAccountDetails
)

userRouter.route("/updateAvatar").patch(
    upload,
    verifyJWT,
    updateAvatar
)

userRouter.route("/updateCoverImage").patch(
    upload,
    verifyJWT,
    updateCoverImage
)

userRouter.route("/user").get(
    verifyJWT, 
    getCurrentUser
)
export default userRouter;