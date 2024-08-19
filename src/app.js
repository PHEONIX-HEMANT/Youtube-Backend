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

export default app;