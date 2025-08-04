import { User } from "../models/user.js";

export const getAllUsers= async (req,res)=>{
    const users= await User.find({});
     console.log(req.query);
     const keyword=req.query.keyword;
     console.log(keyword);
    res.json({
        success: true,
        users,
    })
}

export const register= async (req,res)=>{
    const {name,email,password}= req.body;
    await User.create({
        name,
        email,
        password,
    })

    res.status(201).json({
        success: true,
        message: "Registered Successfully",
    })
}

export const special=(req,res)=>{
    res.json({
        success: true,
        message: "justjoking"
    })
}

export const getuserdetails=async(req,res)=>{
    const {userID}= req.params;
    const user= await User.findById(userID);
    // console.log(req.params);
    res.status(201).json({
        success: true,
        user,
    })

}