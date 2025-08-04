import express from "express";
import { config } from "dotenv";
import router from "./routers/user.js";

config({
    path: "./data/config.env",
})

export const app=express();

app.use(express.json());
app.use(express.urlencoded({extended: true}))
app.use("/api/v1",router);
