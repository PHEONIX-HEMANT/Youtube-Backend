import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

const app = express();

app.use(cors({
    origin : process.env.CORS_ORIGIN,
    credentials : true
})); //use method is used for middlewares

app.use(express.json({limit : "16kb"})); //if data comes from a form, in json form
app.use(express.urlencoded()); // if data comes from url
app.use(express.static("Public")); //configure express to handle static assets in Public folder
app.use(cookieParser());

//routes imports
import userRouter from "./routes/user.routes.js";

//routes declaration
//we will have to use as middlewares, this is the pattern
app.use("/api/v1/users", userRouter);
//http://localhost:4000/api/v1/users/register

export default app;